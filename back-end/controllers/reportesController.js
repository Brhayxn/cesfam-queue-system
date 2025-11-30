const Paciente = require(`../models/Paciente`)
const dayjs = require("dayjs")
const { Op, literal } = require('sequelize');//Operadores sequalize
const sequelize = require("../config/database");
const ReporteDiario = require('../models/ReporteDiario');
const {getAtenciones, getPromedioAtencion, getCancelados, getActividadDiaria} = require('../services/reportServices')

//Endpoints
//Se reutilizara logica de algunos endpoints para armar los servicios y el reporte especifico
//De esta manera solo queda establecer la fecha para el reporte

exports.topDias = async (req, res) => {
    const hoy = dayjs();
    const mesAtras = hoy.subtract(1, "month");

    try {
        const cantidadFecha = await ReporteDiario.findAll({
          attributes: ["fecha", [sequelize.col("registros"), "cantidad"]],
          where: {
            fecha: {
              [Op.between]: [mesAtras.toDate(),hoy.toDate()],
            },
          },
          order: [["cantidad", "DESC"]],
          limit: 5, // Limitar a los 5 días con más registros
        });

        return res.status(200).json(cantidadFecha);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.categorias = async (req, res) => {
    //Periodo de reportes
    const hoy = dayjs();
    const mesAtras = hoy.subtract(1, "month")
    try {
        const categorias = await Paciente.findAll({
            attributes: [
                'categoria',
                [sequelize.fn('COUNT', sequelize.col('categoria')), 'cantidad']
            ],
            group: ['categoria'],
            where: {
                estado: 'Atendido',
                updatedAt: {
                [Op.between]: [mesAtras.toDate(), hoy.toDate()] // Más claro que usar Op.and con gt/lt
                }
            }     
        })
        res.status(200).json(categorias)
    } catch (error) {
        res.status(500).json({ Error: `${error}` })
    }
}


exports.promedioAtencion = async (req, res) => {
    try {
        const data = await getPromedioAtencion()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

exports.actividadDiaria = async (req, res) => {
    try {
        const data = await getActividadDiaria()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

exports.pacientesDiarios = async (req, res) => {
    const ahora = dayjs();
    const hace24Horas = ahora.subtract(1, 'day');

    const estadosPosibles = [
        'En espera',
        'En atencion',
        'En observacion',
        'Ingresado',
        'Atendido'
    ];

    try {
        const pacientes = await Paciente.findAll({
            attributes: [
                'estado',
                [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
            ],
            where: {
                updatedAt: {
                    [Op.gte]: hace24Horas.toDate(),
                    [Op.lt]: ahora.toDate()
                }
            },
            group: ['estado'],
        });

        const conteoPorEstado = {};
        pacientes.forEach(item => {
            conteoPorEstado[item.dataValues.estado] = Number(item.dataValues.cantidad) || 0;
        });

        const resultado = estadosPosibles.map(estado => ({
            estado,
            cantidad: conteoPorEstado[estado] || 0
        }));


        res.status(200).json(resultado);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.reporteEspecifico = async (req, res) => {
    const { fechaInicio, fechaFin } = req.body;

    try {
        if (fechaInicio && fechaFin) {
            // Rango de fechas
            const cantidadFecha = await ReporteDiario.findAll({
                attributes: ['fecha', [sequelize.col('registros'),'cantidad']],
                where: {
                    fecha: {
                        [Op.between]: [fechaInicio, fechaFin]
                    }
                },
                order: [['fecha', 'ASC']]
            });

            const reporteRango = await ReporteDiario.findAll({
              attributes: [
                [sequelize.literal("SUM(registros)"), "totalRegistros"],
                [sequelize.literal("SUM(cancelados)"), "totalCancelados"],
                [sequelize.literal("AVG(promedio)"), "promedioAtencion"]
              ],
              where: {
                fecha: {
                  [Op.between]: [fechaInicio, fechaFin],
                },
              },
            });

            const data = {
                registros: reporteRango,
                atencionesData: cantidadFecha
            }
            

            return res.status(200).json(data);

        } else if (fechaInicio) {
            // Solo una fecha
            const reporte = await ReporteDiario.findOne({
                where: { fecha: fechaInicio }
            });

            if (!reporte) {
                return res.status(404).json({ error: 'No se encontró reporte para esa fecha.' });
            }

            const data = {
                fecha: reporte.fecha,
                actividad: reporte.actividad,
                promedio: reporte.promedio,
                atenciones: reporte.registros,
                cancelados: reporte.cancelados
            };

            return res.status(200).json(data);
        } else {
            return res.status(400).json({ error: 'Debe proporcionar al menos una fecha.' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

