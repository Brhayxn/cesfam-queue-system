const Paciente = require('../models/Paciente');
const dayjs = require('dayjs');
const { Op } = require('sequelize');//Operadores sequalize

// Crear paciente
exports.crear = async (req, res) => {
  try {
    const pacienteCreado = await Paciente.create(req.body);

    // Convertimos el objeto Sequelize a uno plano
    const paciente = pacienteCreado.toJSON();


    // Enviar el evento por socket (accedemos a io desde req.app.locals)
    const io = req.app.locals.io;
    io.emit("pacienteNuevo", paciente); // <-- aquí se envía el mensaje a todos los clientes

    res.status(201).json(paciente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Listar todos los pacientes
exports.listarTodo = async (req, res) => {
  try {
    const pacientesRegistadros = await Paciente.findAll();

    const pacientes = pacientesRegistadros.map(p => {
      const paciente = p.toJSON();
      return {
        id: paciente.id,
        nombre: paciente.nombre,
        categoria: paciente.categoria,
        estado: paciente.estado,
        createdAt: paciente.createdAt,
        updatedAt: paciente.updatedAt
      };
    });

    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar todos los pacientes dependiendo de su estado
exports.listar = async (req, res) => {
  const ahora = dayjs()
  const addHour = ahora.add(1, 'hour')
  const setHour1 = ahora.subtract(2, 'hour')
  const setHour2 = ahora.subtract(8, 'hour')
  const estadoQuery = req.query.state;
  //
  try {
    let pacientesRegistrados = [];

    if (estadoQuery === 'Publico') {
      pacientesRegistrados = await Paciente.findAll({
        where: {
          [Op.or]: [
            { estado: "En observacion" },
            { estado: "En atencion" }
          ]
        }
      });
    } else if (estadoQuery === 'General') {
      pacientesRegistrados = await Paciente.findAll({
        where: {
          [Op.or]: [
            { estado: "En espera" },
            { estado: "En observacion" },
            { estado: "En atencion" }
          ]
        }
      });
    } else if(estadoQuery === "Atendido"){
      pacientesRegistrados = await Paciente.findAll({
        where:{
          estado : 'Atendido',
          updatedAt: {
            [Op.between]: [setHour1.toDate(), addHour.toDate()]
          }
        },
        order: [
          ['updatedAt', 'DESC']
        ],
        raw: true
      })
    }else {
      // Si no es 'publico' ni 'general', buscar por estado directo
      pacientesRegistrados = await Paciente.findAll({
        where: { estado: estadoQuery }
      });
    }
    res.json(pacientesRegistrados);

  } catch (error) {
    console.error(error); // Para ver mejor el error
    res.status(500).json({ error: error.message });
  }
};


// Obtener uno
exports.obtener = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar
exports.actualizar = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ mensaje: 'No encontrado' });

    // Guardamos la fecha antes de actualizar
    const fechaCreacion = dayjs(paciente.createdAt);
    
    // Actualizamos el paciente
    await paciente.update(req.body);

    // Fecha de actualización (después de guardar)
    const fechaActualizacion = dayjs(paciente.updatedAt);

    // Calculamos la diferencia en minutos
    const diferenciaMinutos = fechaActualizacion.diff(fechaCreacion, 'minute');

    // Opcional: formatear las fechas
    const formato = 'DD/MM/YYYY HH:mm';

    const io = req.app.locals.io;
    io.emit("actualizacionPaciente",paciente)

    res.json({
      ...paciente.toJSON(),
      tiempoTranscurrido: `${diferenciaMinutos} minutos`
    });




  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar
exports.eliminar = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ mensaje: 'No encontrado' });

    await paciente.destroy();
    res.json({ mensaje: 'Paciente eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cola de pacientes para llamar
// Esta función maneja la cola de pacientes y emite eventos a través de WebSocket
let cola = [];
let procesando = false;

function procesar(io) {
    if (cola.length === 0) return procesando = false;
    procesando = true;
    
    io.emit("llamadoPaciente", cola[0]);
    
    setTimeout(() => {
        cola.shift();
        procesar(io);
    }, 5000);
}

exports.llamarPaciente = (req, res) => {
    const { nombre, box } = req.body;
    const io = req.app.locals.io;

    cola.push({ nombre, box });
    if (!procesando) procesar(io);

    res.status(200).json({ message: 'OK', cola: cola.length });
};