const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conexion con Base de Datos establecida");
    }catch(error){
        console.log(error);
        throw new Error ("Error al conectar con la base de datos");
    };
};

module.exports = dbConnection;