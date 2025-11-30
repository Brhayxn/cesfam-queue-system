¡Claro! A continuación, te presento un ejemplo de **README.md** profesional, claro y bien estructurado para tu proyecto de gestión de filas en salas de urgencias en Chile (clasificación C1 a C5), usando **WebSockets**, **Express** y **React**:

---

# 🚑 Sistema de Gestión de Filas para Salas de Urgencia (Clasificación C1–C5)

Este proyecto es un sistema web en tiempo real diseñado para gestionar eficientemente las filas de pacientes en salas de urgencia según la **clasificación chilena de triaje C1 a C5**. Utiliza **WebSockets** para sincronización en tiempo real entre el personal médico y las pantallas de sala de espera, y está construido con **Node.js + Express** en el backend y **React** en el frontend.

---

## 📌 Características Principales

-  **Clasificación de pacientes** según los niveles de urgencia C1 (más crítico) a C5 (menos crítico).
-  **Actualización en tiempo real** de la fila mediante WebSockets.
-  **Vista pública de sala de espera**: muestra el estado actual de los pacientes visibles para el público.
-  **Interfaz de gestión**: permite al personal médico agregar, atender, priorizar y cambiar el estado de pacientes.
-  **Gestión de estados**: cada paciente puede estar en estados como *en espera*, *en atención*, *atendido*, *derivado*, etc.

---

## 🛠️ Tecnologías Utilizadas

- **Backend**:  
  - Node.js  
  - Express  
  - WebSocket (`Socket.IO`)  
- **Frontend**:  
  - React (compilado y servido desde Express)  
  - Tailwind CSS
- **Base de datos**:  
  - PostgreSQL 
- **Despliegue**:  
  - Servidor Express sirve tanto la API como los assets estáticos de React.
- **Otros**:   
  - dotenv para variables de entorno

---

## 📦 Instalación Local

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/Brhayxn/cesfam-queue-system
   cd sistema-filas-urgencias
   ```

2. **Instalar dependencias**

   ```bash
   # Backend
   cd ./back-end
   npm install

   # Frontend (si está en una carpeta separada, ej. /frontend)
   cd ./frontend
   npm install
   cd ..
   ```

3. **Compilar el frontend (si no está precompilado)**

   ```bash
   cd ./frontend
   npm run build
   ```

4. **Iniciar el servidor**

   ```bash
   node app.js
   ```

   El servidor correrá en `http://localhost:3000` (o el puerto configurado).

---

## 🧪 Uso

- **Interfaz de Gestión**:  
  Accede a `http://localhost:3000/admin` como personal médico para gestionar usuarios o ver metricas.

- **Sala de Espera (pública)**:  
  Accede a `http://localhost:3000/public` para ver la fila en tiempo real.

---

## 🔐 Variables de Entorno (`/back-end/.env`)

Ejemplo:

```env
# Base de datos (PostgreSQL)
DB_NAME=bd_pacientes
DB_USER=postgres
DB_PASSWORD=root
DB_HOST=localhost
DB_PORT=5432

# JWT (seguridad)
JWT_SECRET=cesfamIcp2025
JWT_EXPIRES_IN=1d
```

---

## 🙌 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un *issue* o envía un *pull request* con tus mejoras.

---

> 💡 **Nota**: Este sistema está pensado para apoyar la gestión hospitalaria en Chile, respetando los protocolos locales de triage en emergencias.

---
