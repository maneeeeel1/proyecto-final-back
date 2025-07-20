const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");

const FRONTEND_URL = process.env.FRONTEND_URL

router.post("/create-checkout-session", async (req, res) =>{
    const { cartItems } = req.body;

    if(!cartItems || cartItems.length === 0){
        return res.status(400).json({error: "El carrito está vacío."});

    }

    try{
        const lineItems = cartItems.map(item => ({
            price_data:{
                currency: "eur",
                product_data:{
                    name:item.nombre,
                    images: item.imagen ? [item.imagen] : []
                },
                unit_amount: Math.round(item.precio*100),
            },
            quantity: item.quantity,
        }));

        const session=await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${FRONTEND_URL}/success`,
            cancel_url: `${FRONTEND_URL}/cart`,
        });

        res.json({url: session.url});
    }catch (error){
        console.error("Error al crear sesión de Checkout:", error);
        res.status(500).json({error: error.message || "Error interno del servidor."})
    }
});

module.exports = router;