async function fetchWithRetries(url, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId); 

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${url}`);
            }
            return await response.json();
        } catch (error) {
            if (i < retries - 1 && (error.name === "AbortError" || error.code === "ETIMEDOUT" || error.message.includes("fetch failed"))) {
                console.warn(`Intento ${i + 1} fallido para ${url}. Reintentando en ${delay}ms... Causa: ${error.message}`);
                await new Promise(res => setTimeout(res, delay));
                delay *= 2; 
            } else {
                throw error;
            }
        }
    }
    throw new Error(`Fallo definitivo después de ${retries} reintentos para ${url}`);
}

async function get151() {
    try {
        const res = await fetchWithRetries("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = res;

        const pLimit = (limit) => {
            let running = 0;
            const queue = [];

            const run = async (fn, ...args) => {
                if (running >= limit) {
                    await new Promise(resolve => queue.push(resolve));
                }
                running++;
                try {
                    return await fn(...args);
                } finally {
                    running--;
                    if (queue.length > 0) {
                        queue.shift()();
                    }
                }
            };
            return run;
        };

        const limit = pLimit(10);

        const detailedPokemons = await Promise.all(
            data.results.map(async (p) => {
                let detail;
                try {
                    detail = await limit(() => fetchWithRetries(p.url));
                } catch (error) {
                    console.error(`Backend Error: Fallo al obtener detalles para ${p.name} (después de reintentos):`, error);
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
                    const speciesDetail = await limit(() => fetchWithRetries(detail.species.url));

                    if (speciesDetail.varieties && speciesDetail.varieties.length > 0) {
                        const megaPromises = speciesDetail.varieties.map(async (variety) => {
                            if (!variety.is_default && variety.pokemon.name.startsWith(detail.name + "-mega")) {
                                try {
                                    const megaDetail = await limit(() => fetchWithRetries(variety.pokemon.url));
                                    return {
                                        id: megaDetail.id,
                                        nombre: megaDetail.name,
                                        imagen: megaDetail.sprites.other["official-artwork"].front_default,
                                        tipo: megaDetail.types.map(t => t.type.name),
                                    };
                                } catch (megaError) {
                                    console.error(`Backend Error: Fallo al obtener detalles para mega ${variety.pokemon.name} (después de reintentos):`, megaError);
                                    return null;
                                }
                            }
                            return null;
                        });
                        megaEvolutions = (await Promise.all(megaPromises)).filter(m => m !== null);
                    }
                } catch (speciesError) {
                    console.error(`Backend Error: No se pudo obtener la especie para ${detail.name} (después de reintentos):`, speciesError);
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
        console.error("Backend Error: Fallo general al iniciar la obtención de Pokémon (después de reintentos):", mainError);
        return [];
    }
}

module.exports = { get151 };