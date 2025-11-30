const Paciente = require('../models/Paciente')
const dayjs = require("dayjs")
const { Op, literal } = require('sequelize');//Operadores sequalize
const sequelize = require("../config/database");



async function getAtenciones(fechaI,fechaF) {
    const fechaInicio = dayjs(fechaI).startOf('day')
    const fechaFinal = dayjs(fechaF).endOf('day')
    const reporte = await Paciente.findAll({
        attributes: [
            [sequelize.fn('DATE',
                sequelize.fn('timezone', 'America/Santiago', sequelize.col('updatedAt'))
            ), 'fecha'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
        ],
        where: {
            estado: 'Atendido',
            updatedAt: {
                [Op.between]: [fechaInicio.toDate(), fechaFinal.toDate()]
            }
        },
        group: [
            sequelize.fn('DATE',
                sequelize.fn('timezone', 'America/Santiago', sequelize.col('updatedAt'))
            )
        ],
        order: [
            ['fecha', 'ASC']
        ],
        raw: true
    })

    return reporte
    
}

async function getPromedioAtencion(fechaInicial, fechaFinal) {
    let fechaInicio, fechaFin;

    // Definir rango de fechas
    if (fechaInicial && !fechaFinal) {
        fechaInicio = dayjs(fechaInicial).startOf('day');
        fechaFin = dayjs(fechaInicial).endOf('day');
    } else if (fechaInicial && fechaFinal) {
        fechaInicio = dayjs(fechaInicial).startOf('day');
        fechaFin = dayjs(fechaFinal).endOf('day');
    } else {
        fechaFin = dayjs();
        fechaInicio = fechaFin.subtract(1, 'month');
    }

    try {
        const resultado = await Paciente.findOne({
            attributes: [
                [
                    // Diferencia en minutos usando EXTRACT(EPOCH FROM updatedAt - createdAt)
                    literal(`ROUND(AVG(EXTRACT(EPOCH FROM "updatedAt" - "createdAt") / 60))`),
                    'promedio_minutos'
                ],
                [
                    literal(`COUNT(*)`),
                    'registros_validos'
                ]
            ],
            where: {
                estado: 'Atendido',
                createdAt: { [Op.ne]: null },
                updatedAt: {
                    [Op.between]: [fechaInicio.toDate(), fechaFin.toDate()]
                }
            },
            raw: true
        });

        return {
            Promedio: resultado.promedio_minutos + ' minutos',
            RegistrosValidos: resultado.registros_validos
        };

    } catch (error) {
        return { Error: error.message };
    }
}

async function getCancelados(fechaInicial, fechaFinal) {
    let fechaFin
    let fechaInicio
    let whereClausule
    if (fechaInicial && !fechaFinal) {
        fechaInicio = dayjs(fechaInicial).startOf('day'); // Inicio del día (00:00:00)
        fechaFin = dayjs(fechaInicial).endOf('day');     // Fin del día (23:59:59)
        whereClausule = {
            estado: 'Cancelado',
            updatedAt: {
                [Op.between]: [fechaInicio.toDate(), fechaFin.toDate()] // Rango de todo el día
            }
        };
    } else if (fechaInicial && fechaFinal) {
        fechaInicio = dayjs(fechaInicial).startOf('day')
        fechaFin = dayjs(fechaFinal).endOf('day')
        whereClausule = {
            estado: 'Cancelado',
            updatedAt: {
                [Op.between]: [fechaInicio.toDate(), fechaFin.toDate()]
            }
        }

    }
    try {
        const data = await Paciente.findAll({
            attributes:[
                [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
            ],
            where:whereClausule,
            raw: true
        })
        return data
    } catch (error) {
        return { Error: error.message };
    }
}

async function getActividadDiaria(fechaSolicitada) {
    let fechaInicio;
    let fechaFin;
    let horasRango;

    if (fechaSolicitada) {
        // Caso: Día específico (00:00 a 23:59)
        fechaInicio = dayjs(fechaSolicitada);
        fechaFin = fechaInicio.add(24, 'hours'); // 23:59:59 del mismo día
        horasRango = Array.from({ length: 24 }, (_, i) =>
            fechaInicio.add(i, 'hour').format('HH:00')
        );
    } else {
        // Caso: Últimas 24 horas (desde ahora - 23 horas hasta ahora + 1 hora)
        const ahora = dayjs();
        fechaFin = ahora.endOf('day') // Hora actual + 1 para incluir registros "ahora"
        fechaInicio = ahora.startOf('day'); // Hora actual - 23 horas
        horasRango = Array.from({ length: 24 }, (_, i) =>
            fechaInicio.add(i, 'hour').format('HH:00')
        );
    }

    const conteo = await Paciente.findAll({
        attributes: [
            [sequelize.fn('DATE_TRUNC', 'hour', sequelize.col('updatedAt')), 'hora'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
        ],
        where: {
            estado: 'Atendido',
            updatedAt: {
                [Op.gte]: fechaInicio.toDate(),
                [Op.lt]: fechaFin.toDate()
            }
        },
        group: ['hora'],
        raw: true
    });

    const conteoPorHora = Object.fromEntries(
        conteo.map(item => [
            dayjs(item.hora).format('HH:00'),
            parseInt(item.cantidad)
        ])
    );

    return horasRango.map(hora => ({
        hora,
        cantidad: conteoPorHora[hora] || 0
    }));
}

module.exports = {
    getAtenciones,
    getPromedioAtencion,
    getCancelados,
    getActividadDiaria
};