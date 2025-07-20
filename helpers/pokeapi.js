async function get151() {
    try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!res.ok) {
            throw new Error(`Error al obtener la lista principal de Pokémon: ${res.statusText}`);
        }
        const data = await res.json();

        const detailedPokemons = await Promise.all(
            data.results.map(async (p) => {
                let detail;
                try {
                    const pokeRes = await fetch(p.url);
                    if (!pokeRes.ok) {
                        throw new Error(`Error al obtener detalles de ${p.name}: ${pokeRes.statusText}`);
                    }
                    detail = await pokeRes.json();
                } catch (error) {
                    console.error(`Backend Error: Fallo al obtener detalles para ${p.name}:`, error);
                    return {
                        id: null,
                        nombre: p.name,
                        imagen: null,
                        tipo: ["unknown"],
                        hasMegaEvolution: false,
                        megaEvolutions: []
                    };
                }

                let megaEvolutions = [];

                try {
                    const speciesRes = await fetch(detail.species.url);
                    if (!speciesRes.ok) {
                        throw new Error(`Error al obtener la especie para ${detail.name}: ${speciesRes.statusText}`);
                    }
                    const speciesDetail = await speciesRes.json();

                    if (speciesDetail.varieties && speciesDetail.varieties.length > 0) {
                        for (const variety of speciesDetail.varieties) {
                            if (!variety.is_default && variety.pokemon.name.startsWith(detail.name + "-mega")) {
                                let megaDetail;
                                try {
                                    const megaRes = await fetch(variety.pokemon.url);
                                    if (!megaRes.ok) {
                                        throw new Error(`Error al obtener detalles de mega ${variety.pokemon.name}: ${megaRes.statusText}`);
                                    }
                                    megaDetail = await megaRes.json();
                                    megaEvolutions.push({
                                        id: megaDetail.id,
                                        nombre: megaDetail.name,
                                        imagen: megaDetail.sprites.other["official-artwork"].front_default,
                                        tipo: megaDetail.types.map(t => t.type.name),
                                    });
                                    
                                } catch (megaError) {
                                    console.error(`Backend Error: Fallo al obtener detalles para mega ${variety.pokemon.name}:`, megaError);
                                }
                            }
                        }
                    }
                } catch (speciesError) {
                    console.error(`Backend Error: No se pudo obtener la especie para ${detail.name}:`, speciesError);
                }
                return {
                    id: detail.id,
                    nombre: detail.name,
                    imagen: detail.sprites.other["official-artwork"].front_default,
                    tipo: detail.types.map(t => t.type.name),
                    hasMegaEvolution: megaEvolutions.length > 0,
                    megaEvolutions: megaEvolutions
                };
            })
        );
        return detailedPokemons;
    } catch (mainError) {
        console.error("Backend Error: Fallo general al iniciar la obtención de Pokémon:", mainError);
        return [];
    }
}

module.exports = { get151 };