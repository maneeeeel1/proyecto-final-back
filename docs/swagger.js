module.exports = {
  openapi: "3.0.0",
  info: {
    title: "API del Proyecto Final",
    version: "1.0.0",
    description: "Documentación de la API: productos, autenticación, pagos y Pokémon.",
  },
  servers: [
    {
      url: "http://localhost:8000/api",
      description: "Servidor local",
    },
  ],
  tags: [
    { name: "Productos" },
    { name: "Autenticación" },
    { name: "Pagos" },
    { name: "Pokémon" },
  ],
  paths: {
    "/products": {
      get: {
        tags: ["Productos"],
        summary: "Obtener todos los productos",
        responses: {
          200: {
            description: "Lista de productos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Productos"],
        summary: "Crear un nuevo producto",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["nombre", "precio", "imagen"],
                properties: {
                  nombre: { type: "string" },
                  precio: { type: "number" },
                  imagen: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Producto creado" },
          500: { description: "Error del servidor" },
        },
      },
    },
    "/products/{id}": {
      put: {
        tags: ["Productos"],
        summary: "Actualizar producto",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  nombre: { type: "string" },
                  precio: { type: "number" },
                  imagen: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Producto actualizado" },
          404: { description: "Producto no encontrado" },
        },
      },
      delete: {
        tags: ["Productos"],
        summary: "Eliminar producto",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Producto eliminado" },
          404: { description: "Producto no encontrado" },
        },
      },
    },

    "/login": {
      post: {
        tags: ["Autenticación"],
        summary: "Iniciar sesión",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "password"],
                properties: {
                  email: { type: "string", format: "text" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login exitoso" },
          401: { description: "Credenciales incorrectas" },
        },
      },
    },
    "/check-auth": {
      get: {
        tags: ["Autenticación"],
        summary: "Verificar sesión activa",
        responses: {
          200: { description: "Usuario autenticado" },
          401: { description: "No autenticado" },
        },
      },
    },
    "/logout": {
      post: {
        tags: ["Autenticación"],
        summary: "Cerrar sesión",
        responses: {
          200: { description: "Sesión cerrada" },
        },
      },
    },

    "/create-checkout-session": {
      post: {
        tags: ["Pagos"],
        summary: "Crear sesión de pago con Stripe",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  cartItems: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        nombre: { type: "string" },
                        precio: { type: "number" },
                        imagen: { type: "string" },
                        quantity: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Sesión de pago creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: { type: "string", format: "uri" },
                  },
                },
              },
            },
          },
          400: { description: "Carrito vacío" },
          500: { description: "Error del servidor" },
        },
      },
    },

    "/pokemon": {
      get: {
        tags: ["Pokémon"],
        summary: "Obtener Pokémon (1ra Generación)",
        responses: {
          200: {
            description: "Pokémon obtenidos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      name: { type: "string" },
                      image: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          500: { description: "Error al obtener Pokémon" },
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          nombre: { type: "string" },
          imagen: { type: "string" },
          precio: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "connect.sid",
      },
    },
  },
};
