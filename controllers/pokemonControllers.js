const { get151 } = require("../helpers/pokeapi.js")

async function obtenerPokemon(req, res) {
    try{
        const pokemons = await get151();
        res.json(pokemons);

    }catch(err){
        res.status(500).json({error:"Error al obtener los pokémon"});

    }
}

module.exports = { obtenerPokemon };