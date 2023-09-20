// servidor 
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3009;

// incluyo funciones declaradas en mongodb.js
const { connectToMongodb, disconnectToMongodb} = require('./src/database/mongodb')
// para evitar TypeError: Cannot read property '_id' of undefined
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//Middleware
app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});
app.get('/', (req, res) => { res.status(200).end('¡Bienvenido a la API de Prendass!'); } );







app.get("*", (req, res) => {
    res.json({
      error: "404",
      message: "No se encuentra la ruta solicitada",
    });
  });
  
  //Inicia el servidor
  app.listen(PORT, () => console.log(`API de Prendas escuchando en http://localhost:${PORT}`) );
  