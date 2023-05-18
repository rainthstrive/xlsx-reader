# XLSX Processor API

La siguiente API procesa archivos XLSX y sube los resultados a una BDD en MongoDB.
_Nota:_ Se debe proporcionar su propia llave de conexión para MongoDB.

## Endpoints


El endpoint POST en _/data/upload_ realiza las siguientes acciones:

1.  Recibe un archivo XLSX como entrada.
2.  Utiliza la librería SheetJS para procesar el contenido del archivo XLSX y extraer los datos relevantes.
3.  Estos datos se preparan para su almacenamiento en MongoDB.
4.  Se establece una conexión con la base de datos MongoDB utilizando la librería Mongoose.
5.  Los datos procesados se insertan en la base de datos, siguiendo el esquema y el modelo definidos.
6.  Una vez que los datos se han subido correctamente a MongoDB, se proporciona una respuesta al cliente indicando el éxito de la operación.

## Parámetros

El endpoint POST _/data/upload_ espera recibir un archivo XLSX en el cuerpo de la solicitud. El archivo debe ser enviado utilizando el tipo de contenido "multipart/form-data".
El archivo debe contener las siguientes cabeceras: **Nombre | Edad | Nums**.
El archivo soporta hasta **20,000** líneas de información, y **5,000** números en la cabecera **Nums**.

## Respuesta

La API regresará un status _201_, y un id.

    { id: "507f191e810c19729de860ea" }


## Librerías usadas.

### NodeJS

Se utiliza para desarrollar aplicaciones del lado del servidor y proporciona un entorno de tiempo de ejecución rápido y eficiente. En el caso de la API mencionada, NodeJS se utiliza como el entorno principal para ejecutar el código de backend y facilitar la comunicación entre las distintas librerías.

### SheetJS

SheetJS es una librería de JavaScript que permite leer, procesar y escribir archivos en formato XLSX (Excel). En el contexto de la API mencionada, SheetJS se utiliza para procesar los archivos XLSX enviados a la API, extrayendo los datos relevantes y preparándolos para su posterior almacenamiento en la base de datos MongoDB.

### Express

Express es un framework web rápido y minimalista para NodeJS. En el caso de la API mencionada, Express se utiliza para crear y gestionar las rutas HTTP necesarias para procesar las solicitudes de los clientes y proporcionar las respuestas correspondientes.

