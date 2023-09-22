// servidor 
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3009;
const { ObjectId } = require('mongodb');


// incluyo funciones declaradas en mongodb.js
const { connectToMongodb, disconnectFromMongodb } = require('./src/database/mongodb')
// para evitar TypeError: Cannot read property '_id' of undefined
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//Middleware
app.use((req, res, next) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});


app.get('/', (req, res) => { 
  res.status(200).end('¡Bienvenido a la API de Prendass!'); 
});


app.get('/prendas', async (req, res) => {
  const client = await connectToMongodb();
  if (!client) {
    res.status(500).send('Error al conectarse a MongoDB');
  };
  const db = client.db('Prendas');
  const prendas = await db.collection('prendas').find().toArray();
  await disconnectFromMongodb();
  res.json(prendas);
});


//busqueda por id de una prenda
app.get('/prendas/id/:id', async (req, res) => {
  const idPrenda = req.params.id || 0;

  //verificacion de la cadena hexadecimal
  const esObjValido = /^[0-9a-fA-F]{24}$/.test(idPrenda);
  if (!esObjValido) {
    res.status(400).json('id no valido: ' + idPrenda);
    return;
  }

  const client = await connectToMongodb();
  if (!client) {
    res.status(500).send('Error al conectarse a MongoDB');
  };
  const db = client.db('Prendas');
  const prenda = await db.collection('prendas').findOne({ _id: new ObjectId(idPrenda) });
  await disconnectFromMongodb();
  prenda != null ? res.json(prenda) : res.status(404).json('No se encontro una prenda con el id: ' + idPrenda);
});


//elimina una prenda
app.delete('/prendas/:id', async (req, res) => {
  const idPrenda = req.params.id;
  client = await connectToMongodb();
  if (!client) {
    res.status(500).send('Error al conectarse a MongoBD');
    return;
  };
  const db = client.db('Prendas');

  try {
    const resultado = await db.collection('prendas').deleteOne({ _id: new ObjectId(idPrenda) });

    if (resultado.deletedCount === 0) {
      res.status(404).send('No se encontro una prenda con _id: ' + idPrenda);
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).send('Error al eliminar la prenda, formato de id invalido');
  } finally {
    await disconnectFromMongodb();
  }
});



app.get("*", (req, res) => {
  res.json({
    error: "404",
    message: "No se encuentra la ruta solicitada",
  });
});

//Inicia el servidor
app.listen(PORT, () => console.log(`API de Prendas escuchando en http://localhost:${PORT}`));
