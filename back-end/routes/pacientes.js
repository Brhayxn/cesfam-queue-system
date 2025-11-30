const express = require('express');
const router = express.Router();
const controller = require('../controllers/pacienteController');
const auth = require('../config/authMiddleware')

router.post('/',auth,controller.crear);
router.get('/estado',controller.listar)
router.get('/',auth ,controller.listarTodo);
router.get('/:id',auth,controller.obtener);
router.put('/:id',auth,controller.actualizar);
router.delete('/:id',auth,controller.eliminar);
router.post('/llamar',auth,controller.llamarPaciente);


module.exports = router;
