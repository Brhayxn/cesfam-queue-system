const ReporteDiario = require("../models/ReporteDiario");
const Paciente = require("../models/Paciente");
const dayjs = require("dayjs");
const { Op, literal } = require("sequelize"); // Operadores sequelize
const sequelize = require("../config/database");
const {
  getAtenciones,
  getPromedioAtencion,
  getCancelados,
  getActividadDiaria,
} = require("../services/reportServices");
const { parse } = require("dotenv");

async function generarReporte() {
  const hoy = dayjs();
  const fechaInicio = hoy.subtract(1, "day").startOf("day");
  const fechaFin = hoy.subtract(1, "day").endOf("day");
  console.log("reporteProgramado service called");
  let data;
  const actividad = await getActividadDiaria(fechaInicio);
  const promedio = await getPromedioAtencion(fechaInicio);
  const cancelados = await getCancelados(fechaInicio, fechaFin);

  /*  fecha: '2025-07-30',
  actividad: [
    { hora: '00:00', cantidad: 0 },
    { hora: '01:00', cantidad: 0 },
    // ...
    { hora: '16:00', cantidad: 2 },
    // ...
    { hora: '23:00', cantidad: 0 }
  ],
  promedio: {
    Promedio: '342 minutos',
    RegistrosValidos: '2'
  },
  cancelados: [
    { cantidad: '5' }
  ]*/

  let promedioResult = promedio.Promedio || 0;
  let registrosValidos = promedio.RegistrosValidos || 0;
  let canceladosResult = cancelados[0].cantidad || 0;
  let fecha = fechaInicio.format("YYYY-MM-DD");

  console.log(canceladosResult)

  const nuevoReporte = await ReporteDiario.create({
    fecha,
    actividad,
    promedio: parseInt(promedioResult),
    registros: parseInt(registrosValidos),
    cancelados: parseInt(canceladosResult),
  });
  console.log("Reporte insertado:", nuevoReporte.toJSON());

  await Paciente.destroy({
    where: {
      updatedAt: {
        [Op.between]: [fechaInicio.toDate(), fechaFin.toDate()],
      },
      estado: {
        [Op.in]: ["Cancelado", "Atendido"],
      },
    },
  });
}

module.exports = {
  generarReporte,
};
