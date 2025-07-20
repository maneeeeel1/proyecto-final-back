const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    imagen:{
        type: String,
        required: true,
        trim: true
    },
    precio:{
        type: Number,
        required: true,
        min: 0
    }

},{timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;