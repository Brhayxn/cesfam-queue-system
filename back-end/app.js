const express = require('express');
const morgan = require("morgan");
const sequelize = require('./config/database');
const pacientesRoutes = require('./routes/pacientes');
const usuariosRoutes = require('./routes/usuarios');
const reportesRoutes = require('./routes/reportes')
const cors = require('cors');
const http = require("http");
const path = require("path");
const cron = require('node-cron'); //Reporte programado
const {generarReporte} = require('./services/reporteProgramadoServices');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Servidor WebSocket con CORS
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:*",
      "http://192.168.*:*",
      "exp://*"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Compartir io con toda la app (usando app.locals)
app.locals.io = io;

// Middlewares
app.use(cors());

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));



// Rutas
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/auth', usuariosRoutes);
app.use('/api/reportes', reportesRoutes)

// Ruta principal
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

//Reporte programado
cron.schedule('33 11 * * *', async () => {
  console.log('Generando reporte diario a las 9:30 AM...');
  await generarReporte(); // Tu función personalizada que genera el reporte
});

// Eventos socket
io.on("connection", (socket) => {
  socket.on("disconnect", () => { 
  });
});

// Iniciar servidor y DB
sequelize.sync().then(() => {
  console.log('Base de datos sincronizada');
  server.listen(3000, '0.0.0.0',() => console.log('Servidor en puerto 3000'));
}).catch(err => console.error('Error al conectar DB:', err));
