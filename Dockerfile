FROM node:18-alpine
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build 

WORKDIR /app/back-end
COPY back-end/package*.json ./
RUN npm install
COPY back-end ./

EXPOSE 5000
CMD [ "node","app.js" ]
