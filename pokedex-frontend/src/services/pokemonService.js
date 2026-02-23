const BASE_URL = 'https://localhost:7266/api/pokemon'

export async function getPokemonList(page = 1, pageSize = 20) {
    const response = await fetch(`${BASE_URL}?page=${page}&pageSize=${pageSize}`)
    if (!response.ok) throw new Error('Failed to fetch pokemon list')
    return response.json()
}

export async function getPokemonDetail(nameOrId) {
    const response = await fetch(`${BASE_URL}/${nameOrId}`)
    if (!response.ok) throw new Error(`Failed to fetch pokemon: ${nameOrId}`)
    return response.json()
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