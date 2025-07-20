const express = require("express");
const router = express.Router();
const { obtenerPokemon } = require("../controllers/pokemonControllers.js");

router.get("/pokemon", obtenerPokemon);

module.exports = router;