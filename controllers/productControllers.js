const Product = require("../models/product");

const createProduct = async (req,res) =>{
    try{
        const{nombre,precio} = req.body;
        const imagen = req.file.path;

        const newProduct = new Product ({nombre,precio,imagen});
        await newProduct.save();

        res.status(201).json({massage: "Producto creado", product: newProduct});

    }catch (err){
        console.error(err);
        res.status(500).json({error: "Error al crear producto"});
    }
};

const getProducts = async (req, res)=>{
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Error al obtener productos"});
    }
}

const deleteProduct = async (req,res) =>{
    try{
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if(!deletedProduct){
            return res.status(404).json({error: "Producto no encontrado"});
        }

        res.status(200).json({message:"Producto eliminado con exito", product: deletedProduct});
    }catch (err){
        console.error("Error al eliminar producto", err);
        res.status(500).json({error: "Error del servidor al eliminar producto"});
    }

}

const updateProduct = async (req,res) =>{
    try{
        const { id } = req.params;
        const { nombre,precio } = req.body;
        let updateData = { nombre,precio };

        if(req.file){
            updateData.imagen = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {new: true});


        if(!updatedProduct){
            return res.status(404).json({error: "Producto no encontrado para actualizar"});
        }

        res.status(200).json({message:"Producto actualizado con exito", product: updatedProduct});
    }catch (err){
        console.error("Error al actualizar producto", err);
        res.status(500).json({error: "Error del servidor al actualizar producto"});
    }
}

module.exports = { createProduct, getProducts, deleteProduct, updateProduct }