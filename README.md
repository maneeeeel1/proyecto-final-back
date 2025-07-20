#🚀 BACKEND PROYECTO FINAL:

Este es el componente de backend para la aplicación del proyecto final, encargado de gestionar datos de productos, usuarios, autenticación, pagos ,la información de la Pokédex, Socket.io... Expone una API RESTful para que el frontend pueda interactuar con la base de datos y la lógica de negocio.



##🌟 CARACTERISTICAS PRINCIPALES

--GESTIÓN DE PRODUCTOS:--

CRUD completo para productos (crear, leer, actualizar, eliminar).

Carga de imágenes de productos a Cloudinary.

--AUTENTIFICACIÓN Y AUTORIZACIÓN:--

Registro y login de usuario administrador.

Protección de rutas para acciones administrativas (ej. crear/editar/eliminar productos).

--API POKÉDEX:--

Endpoints para obtener datos de Pokémon (/pokemon).

--PROCESAMIENTO DE PAGOS:--

Integración para gestionar transacciones de pago (ej. /api/create-checkout-session).

--COMUNICACIÓN TIEMPO REAL:--

Uso de Socket.IO para jugar al mismo tiempo con amigos.

--PERSISTENCIA DE DATOS:--

Conexión a MongoDB usando Mongoose.

--DOCUMENTACIÓN API:--

Interfaz interactiva de Swagger UI para explorar y probar los endpoints.



###🛠️ Tecnologías Utilizadas

-Node.js: Entorno de ejecución de JavaScript.

-Express.js: Framework de aplicaciones web para Node.js.

-MongoDB: Base de datos NoSQL.

-Mongoose: ODM (Object Data Modeling) para MongoDB.

-Dotenv: Para variables de entorno.

-JSON Web Tokens (JWT): Para autenticación basada en tokens.

-Stripe: Para el procesamiento de pagos.

-Multer & Cloudinary: Para la carga y almacenamiento de imágenes.

-Socket.IO: Para comunicación bidireccional en tiempo real.

-CORS: Middleware para habilitar el Cross-Origin Resource Sharing.

-Express-session: Para la gestión de sesiones.

-Swagger-UI-Express & Swagger-JSdoc: Para la documentación interactiva de la API.



####🚀 Puesta en Marcha

Sigue estos pasos para levantar el backend en tu entorno local.

--Prerequisitos--
Antes de comenzar, asegúrate de tener instalado lo siguiente:

-Node.js (versión 114 o superior recomendada).

-Una instancia local de MongoDB corriendo.

O una base de datos en la nube como MongoDB Atlas.



--Instalación--
-Clona el repositorio de git.

-Instala las dependencias: npm install

-Si encuentras errores de resolución de dependencias (peer dependencies), prueba con: npm install --legacy-peer-deps   



--Configura las variables de entorno:--

Crea un archivo llamado .env en la raíz de la carpeta backend con las siguientes variables. Asegúrate de reemplazar los valores de ejemplo con los tuyos:

PORT=8000

MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority 

SESSION_SECRET=un_secreto_super_seguro CLOUD_NAME=tu_cloud_name_cloudinary 

API_KEY=tu_api_key_cloudinary 

API_SECRET=tu_api_secret_cloudinary

STRIPE_SECRET_KEY=tu_secret_key



--Iniciar el Servidor--

Desde la carpeta backend, ejecuta el siguiente comando: node index.js    

El servidor debería iniciarse y escuchar en el puerto especificado en tu archivo .env (por defecto, http://localhost:8000). Verás un mensaje en la consola como: server listening http://localhost:8000.



#####📋 Documentación de la API (Swagger UI)
Una vez que el servidor backend esté corriendo, puedes acceder a la documentación interactiva de la API utilizando Swagger UI.

Abre tu navegador y navega a:

http://localhost:8000/api-docs

Aquí podrás ver todos los endpoints disponibles, sus métodos HTTP, parámetros, cuerpos de solicitud y posibles respuestas. También podrás probar los endpoints directamente desde la interfaz.




######📂 Estructura del Proyecto
backend/
├── config/              # Configuraciones de la aplicación (DB,Cloudinary,Stripe)
│   ├── db.js  
    ├── cloudinary.js    
│   └── stripe.js        
├── controllers/         # Lógica para cada ruta
│   |── productControllers.js
    ├── authControllers.js
│   └── pokemonControllers.js
├── docs/
    ├── swagger.js       #Lógica documentación Swagger
├── helpers/
    ├── pokeapi.js       #Lógica para enviar megaevoluciones
├── middleware/          # Middlewares personalizados (autenticación, cloudinary)
│   ├── authMiddleware.js
│   └── cloudinaryMiddleware.js
├── models/              # Definiciones de esquemas de datos (Mongoose)
│   └── product.js
├── routes/              # Definición de las rutas de la API
│   ├── authRoutes.js
│   ├── paymentRoutes.js
│   ├── pokemonRoutes.js
│   └── productRoutes.js
├── socket/              # Lógica de Socket.IO
│   └── socketManager.js
├── .env                 # Archivo de ejemplo para variables de entorno
├── .gitignore           # Archivos y carpetas ignorados por Git
├── index.js             # Punto de entrada principal del servidor
├── package.json         # Dependencias y scripts del proyecto
└── package-lock.json    # Versiones exactas de las dependencias



