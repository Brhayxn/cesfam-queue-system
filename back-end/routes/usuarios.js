const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController'); 

router.get('/', controller.verUsuarios);
router.post('/', controller.login);
router.delete('/:id', controller.deleteUser);
router.post('/registrar', controller.registrar);

module.exports = router;