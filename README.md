# INGENIAS-Pre-entrega2

<!-- http://localhost:3009/prendas/650a4bb09c7815047f71df7d -->

<h1 align="center" style = "margin: 0 auto;  height: 200px; overflow: hidden;" >
  <p align="center">API PRENDAS</p>
  <a href="" ><img style=" width: 100%; text-align: center; " src="./public/image/ropa.jpg" alt="Mobiliarios"></a>
</h1>

## Tabla de contenidos
- [INGENIAS-Pre-entrega2](#ingenias-pre-entrega2)
  - [Tabla de contenidos](#tabla-de-contenidos)
    - [Información General](#información-general)
    - [Link URL base](#link-url-base)
    - [Objeto Mobiliario](#objeto-mobiliario)
    - [Peticiones](#peticiones)
    - [Métodos](#métodos)
      - [Método PUT](#método-put)
      - [Metodo DELETE](#metodo-delete)
    - [Archivo .ENV](#archivo-env)
    - [Graficos](#graficos)
    - [Colaboradores](#colaboradores)

### Información General
***
<div class="warning" style='padding:0.1em; background-color:#E9D8FD; color:#69337A'>
<span>
<p style='margin-left:1em;'>
La Api prendas, es un proyecto para <b>Visualizar,Crear, Actualizar y Eliminar</b> fácilmente productos mobiliarios, con unas
caracteristicas como codigo, nombre, precio y categoria.
Su clave primaria es el ID de MongoDB
</p>
</p></span>
</div>
 

### Link URL base
***
<!-- http://localhost:3000/api/v1/ -->
http://localhost:3009

### Objeto Mobiliario
***
```javascript
// ejemplo de la estructura de Prendas
 {   
    "codigo": 28,
    "nombre": "Vestido de Punto ",
    "precio": 300,
    "categoria": "Outfit"
  }
```

###  Peticiones 
***
| PETICION | URL                                     | DESCRIPCION                           |
| :------- | :-------------------------------------- | :-----------------------------------  |
| GET      | [/prendas](http://localhost:3009/prendas/) | Devuelve todos las prendas |
| GET      | [/prendas/nombre](http://localhost:3009/prendas/nombre/:nombre) | Devuelve todas las prendas cargados con el nombre solicitada |
| POST     | [/prendas](http://localhost:3009/prendas)     | Agregar una prenda     |
| PUT      | [/prendas/:id](http://localhost:3009/prendas/:id) | Modificar una prenda a partir del ObjetID |
| DELETE   | [/prendas/:id](http://localhost:3009/prendas/:id) | Eliminar un producto pasandole el ObjetID |

### Métodos
#### Método PUT
***
> [!NOTE]  
> Este método va actualizar la prenda recibiendo el objetID  y los campos del objeto a modificar en la base de datos
```javascript

// Endpoint PUT para modificar una prenda por su ID
app.put('/prendas/:id', async (req, res) => {
  const idPrenda = req.params.id;
  const prendaModificada = req.body;
  if (!prendaModificada || Object.keys(prendaModificada).length === 0) {
    return res.status(400).send('Error en el formato de los datos ingresados');
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
      return res.status(404).send('Prenda no encontrada');
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
```

#### Metodo DELETE
***
> [!NOTE]  
> Este método elimina un producto mobiliario pasandole el código en la base de datos 
```javascript
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
```

### Archivo .ENV
***
```
PORT=3009
MONGODB_URLSTRING=mongodb+srv://admin:admin@cluster0.5dxhuuy.mongodb.net/?retryWrites=true&w=majority
```

### Graficos 
```mermaid
graph TD
  A[Inicio] --> B[Crear servidor Express]
  B --> C[Agregar los require necesarios]
  C --> D[Incluir las funciones deconectar y desconectar declaradas en src/mongodb.js]
  D --> E[Definir endpoint GET /prendas]
  D --> F[Definir endpoint PUT /prendas/:id]
  D --> G[Definir endpoint GET /prendas/nombre/:nombre]
  E --> I[Retornar todo el contenido]
  F --> J[Aplicar filtro por Id de ObjetKey]
  G --> K[Aplicar filtro por nombre de prenda]
```
### Colaboradores 
***
<a href="https://github.com/antonellamino/INGENIAS-Pre-entrega2/graphs/contributors" target="_blank">
<img alt="Carolina Mendez" title="Carolina Mendez" style=" width: 60px; /* Tamaño de los avatares */
  height: 60px;
  border-radius: 50%;" src="https://avatars.githubusercontent.com/u/49485102?s=60&v=4?width=890
  "></a>
  <a href="https://github.com/antonellamino/INGENIAS-Pre-entrega2/graphs/contributors" target="_blank">
<img alt="Carolina Mendez" title="Carolina Mendez" style=" width: 60px; /* Tamaño de los avatares */
  height: 60px;
  border-radius: 50%;" src="https://avatars.githubusercontent.com/u/69389897?s=60&v=4?width=890
  "></a>
<!-- <img src=""> -->



