const POKEAPI_POKEMON = 'https://pokeapi.co/api/v2/pokemon'

export async function getPokemonList(page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize
    const response = await fetch(`${POKEAPI_POKEMON}?limit=${pageSize}&offset=${offset}`)
    if (!response.ok) throw new Error('Failed to fetch pokemon list')
    return response.json()
}

export async function getPokemonDetail(nameOrId) {
    const response = await fetch(`${POKEAPI_POKEMON}/${nameOrId}`)
    if (!response.ok) throw new Error(`Failed to fetch pokemon: ${nameOrId}`)
    const data = await response.json()
    return {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        baseExperience: data.base_experience,
        imageUrl:
            data.sprites?.other?.['official-artwork']?.front_default ??
            data.sprites?.front_default ??
            null,
        shinyImageUrl:
            data.sprites?.other?.['official-artwork']?.front_shiny ??
            data.sprites?.front_shiny ??
            null,
        types: data.types.map(t => t.type.name),
        abilities: data.abilities.map(a => ({
            name: a.ability.name,
            isHidden: a.is_hidden,
        })),
        stats: data.stats.map(s => ({
            name: s.stat.name,
            value: s.base_stat,
        })),
        moves: data.moves.slice(0, 20).map(m => m.move.name),
        sprites: data.sprites,
    }
}

export async function getAbilityList() {
    const response = await fetch('https://pokeapi.co/api/v2/ability?limit=400')
    if (!response.ok) throw new Error('Failed to fetch abilities')
    return response.json()
}

export async function getAbilityDetail(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${name}`)
    if (!response.ok) throw new Error('Failed to fetch ability detail')
    return response.json()
}

export async function getTypeList() {
    const response = await fetch('https://pokeapi.co/api/v2/type?limit=100')
    if (!response.ok) throw new Error('Failed to fetch types')
    return response.json()
}

export async function getTypeDetail(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${name}`)
    if (!response.ok) throw new Error('Failed to fetch type detail')
    return response.json()
}

export async function getRegionList() {
    const response = await fetch('https://pokeapi.co/api/v2/region?limit=20')
    if (!response.ok) throw new Error('Failed to fetch regions')
    return response.json()
}

export async function getRegionDetail(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/region/${name}`)
    if (!response.ok) throw new Error('Failed to fetch region detail')
    return response.json()
}

export async function getLocationDetail(url) {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch location')
    return response.json()
}

export async function getLocationAreaDetail(url) {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch location area')
    return response.json()
}

export async function getPokemonSpecies(nameOrId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameOrId}`)
    if (!response.ok) throw new Error('Failed to fetch species')
    return response.json()
}

export async function getEvolutionChain(url) {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch evolution chain')
    return response.json()
}