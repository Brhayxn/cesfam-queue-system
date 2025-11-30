const express = require('express');
const router = express.Router();
const controller = require("../controllers/reportesController")

router.get( "/topDias" , controller.topDias )
router.get( "/categorias" , controller.categorias )
router.get( "/promedio" , controller.promedioAtencion )
router.get( "/actividadDiaria" , controller.actividadDiaria )
router.get( "/pacientesDiarios" , controller.pacientesDiarios )
router.post( "/rangoFecha" , controller.reporteEspecifico )

module.exports = router;