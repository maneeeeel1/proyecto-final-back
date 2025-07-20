require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");
const dbConnection = require("./config/db.js");
const swagger = require("swagger-ui-express");
const swaggerDocs = require("./docs/swagger.js")

const app = express();
const PORT = process.env.PORT || 7000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const socketManager = require("./socket/socketManager.js");
socketManager(io);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "secreto",
  resave: false,
  saveUninitialized: false,
  cookie:{
    secure: false,
    httpOnly: true
  }
}))

const paymentRoutes = require("./routes/paymentRoutes.js");
app.use("/api", paymentRoutes);

const pokemonRoutes = require ("./routes/pokemonRoutes.js");
app.use("/api", pokemonRoutes);

const authRoutes = require("./routes/authRoutes.js");
app.use("/api", authRoutes);

const productRoutes = require("./routes/productRoutes.js");
app.use("/api/products", productRoutes);

app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocs));


dbConnection();

server.listen(PORT, () =>{
    console.log(`server listening http://localhost:${PORT}`)
})