// servidor 
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3009;


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
      console.info('Se eliminó correctamente')
    }
  } catch (error) {
    res.status(500).send('Error al eliminar la prenda, formato de id invalido');
  } finally {
    await disconnectFromMongodb();
  }
});


//Endpoints GET
app.get('/prendas/nombre/:nombre', async (req, res) => {
  const nombre = req.params.nombre
  const regex = new RegExp(nombre.toLowerCase(), 'i');
  if (nombre) {
    const client = await connectToMongodb();
    if (!client) {
      res.status(500).send('Error al conectarse a MongoDB')
      return;
    }
    const db = client.db('Prendas')
    const prendas = await db.collection('prendas').find({ nombre: regex }).toArray()
    await disconnectFromMongodb()
    if (prendas == "") {
      res.send('No hay productos que contenga ese nombre ')
    }
    else {
      res.json(prendas)
    }
  }
  else {
    res.status(400).send('Error consulta vacia')
  }
});


// Endpoint POST para agregar una nueva prenda
app.post('/prendas', async (req, res) => {
  const nuevaPrenda = req.body;

  if (!nuevaPrenda || Object.keys(nuevaPrenda).length === 0) {
    return res.status(400).send('Error en el formato de los datos ingresados');
  }

  // Elimina el campo _id si está presente
  if (nuevaPrenda._id) {
    delete nuevaPrenda._id;
  }

  if (
    typeof nuevaPrenda.codigo !== 'number' ||
    typeof nuevaPrenda.nombre !== 'string' ||
    typeof nuevaPrenda.precio !== 'number' ||
    typeof nuevaPrenda.categoria !== 'string'
  ) {
    return res.status(400).send('Error en el formato de los datos ingresados, recuerde que el código es numérico, el nombre es una cadena de caracteres, el precio es numérico  y la categoría es una cadena de caracteres');
  }

  const client = await connectToMongodb();

  if (!client) {
    return res.status(500).send('Error al conectarse a MongoDB');
  }

  const db = client.db('Prendas');
  const prendasCollection = db.collection('prendas');

  try {
    const result = await prendasCollection.insertOne(nuevaPrenda);
    console.log('Se creó el producto prendas');
    const mensaje = 'Se creó el producto prendas';
    res.status(200).json({ descripcion: mensaje, objeto: nuevaPrenda });
  } catch (err) {
    console.error(err);
    res.status(500).json({ descripcion: 'Error al insertar la prenda', error: err });
  } finally {
    client.close();
  }
});


// Endpoint PUT para modificar una prenda por su ID
app.put('/prendas/:id', async (req, res) => {
  const idPrenda = req.params.id;
  const prendaModificada = req.body;
  if (!prendaModificada || Object.keys(prendaModificada).length === 0) {
    return res.status(400).send('Error en el formato de los datos ingresados');
  }

  // Elimina el campo _id si está presente
  if (prendaModificada._id) {
    delete prendaModificada._id;
  }

  // Validación de datos
  if (typeof prendaModificada.codigo !== 'number' ||
    typeof prendaModificada.nombre !== 'string' ||
    typeof prendaModificada.precio !== 'number' ||
    typeof prendaModificada.categoria !== 'string'
  ) {
    return res.status(400).send('Error en el formato de los datos ingresados, recuerde que el código es numérico, el nombre es una cadena de caracteres, el precio es numérico  y la categoría es una cadena de caracteres');
  }

  const client = await connectToMongodb();
  if (!client) {
    res.status(500).send('Error al conectarse a MongoDB')
    return;
  }

  const db = client.db('Prendas');
  const prendasCollection = db.collection('prendas');

  try {
    const result = await prendasCollection.updateOne(
      { _id: new ObjectId(idPrenda) }, // Crear una instancia de ObjectId
      { $set: prendaModificada }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Prenda con el ID : ' + idPrenda + ' no encontrada');
    }

    console.log(`Se modificó correctamente la prenda con ID ${idPrenda}`);
    const mensaje = `Se modificó correctamente la prenda con ID ${idPrenda}`;
    res.status(200).json({ descripcion: mensaje, objeto: prendaModificada });
  } catch (err) {
    console.error(err);
    res.status(500).json({ descripcion: 'Error al actualizar la prenda', error: err });
  } finally {
    client.close();
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
