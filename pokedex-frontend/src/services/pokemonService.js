// ── Pokémon Service ───────────────────────────────────────────────
// Calls PokéAPI directly (no .NET backend needed in production)
// ─────────────────────────────────────────────────────────────────

const POKEAPI = 'https://pokeapi.co/api/v2'

// Some Pokémon only have sprites/data under a specific form endpoint.
// We fetch the form endpoint but return the base species name so
// routing and links always use the clean name (e.g. /pokemon/zygarde).
const DETAIL_OVERRIDES = {
    'zygarde': 'zygarde-50',
    'giratina': 'giratina-altered',
    'shaymin': 'shaymin-land',
    'tornadus': 'tornadus-incarnate',
    'thundurus': 'thundurus-incarnate',
    'landorus': 'landorus-incarnate',
    'enamorus': 'enamorus-incarnate',
    'keldeo': 'keldeo-ordinary',
    'meloetta': 'meloetta-aria',
    'deoxys': 'deoxys-normal',
    'hoopa': 'hoopa',
    'urshifu': 'urshifu-single-strike',
    'calyrex': 'calyrex',
    'ogerpon': 'ogerpon-teal',
    'terapagos': 'terapagos-normal',
    'basculegion': 'basculegion-male',
    'indeedee': 'indeedee-male',
    'lycanroc': 'lycanroc-midday',
    'wishiwashi': 'wishiwashi-solo',
    'minior': 'minior-red-meteor',
    'mimikyu': 'mimikyu-disguised',
    'toxtricity': 'toxtricity-amped',
    'eiscue': 'eiscue-ice',
    'morpeko': 'morpeko-full-belly',
    'darmanitan': 'darmanitan-standard',
    'oricorio': 'oricorio-baile',
}

// ── Pokemon List ─────────────────────────────────────────────────
export async function getPokemonList(limit = 20, offset = 0) {
    const response = await fetch(`${POKEAPI}/pokemon?limit=${limit}&offset=${offset}`)
    if (!response.ok) throw new Error('Failed to fetch Pokémon list')
    return response.json()
}

// ── Pokemon Detail ───────────────────────────────────────────────
export async function getPokemonDetail(nameOrId) {
    const apiName = typeof nameOrId === 'string'
        ? (DETAIL_OVERRIDES[nameOrId.toLowerCase()] || nameOrId)
        : nameOrId
    const response = await fetch(`${POKEAPI}/pokemon/${apiName}`)
    if (!response.ok) throw new Error(`Pokémon not found: ${nameOrId}`)
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

// ── Abilities ────────────────────────────────────────────────────
export async function getAbilityList(limit = 20, offset = 0) {
    const response = await fetch(`${POKEAPI}/ability?limit=${limit}&offset=${offset}`)
    if (!response.ok) throw new Error('Failed to fetch abilities list')
    return response.json()
}
// alias
export const getAbilitiesList = getAbilityList

export async function getAbilityDetail(nameOrId) {
    const response = await fetch(`${POKEAPI}/ability/${nameOrId}`)
    if (!response.ok) throw new Error(`Ability not found: ${nameOrId}`)
    return response.json()
}

// ── Types ────────────────────────────────────────────────────────
export async function getTypesList() {
    const response = await fetch(`${POKEAPI}/type?limit=100`)
    if (!response.ok) throw new Error('Failed to fetch types list')
    return response.json()
}
// alias
export const getTypeList = getTypesList

export async function getTypeDetail(nameOrId) {
    const response = await fetch(`${POKEAPI}/type/${nameOrId}`)
    if (!response.ok) throw new Error(`Type not found: ${nameOrId}`)
    return response.json()
}

// ── Location / Route ─────────────────────────────────────────────
export async function getLocation(nameOrId) {
    const response = await fetch(`${POKEAPI}/location/${nameOrId}`)
    if (!response.ok) throw new Error(`Location not found: ${nameOrId}`)
    return response.json()
}

export async function getLocationArea(nameOrId) {
    const response = await fetch(`${POKEAPI}/location-area/${nameOrId}`)
    if (!response.ok) throw new Error(`Location area not found: ${nameOrId}`)
    return response.json()
}

// ── Species & Evolution ──────────────────────────────────────────
export async function getPokemonSpecies(nameOrId) {
    // Species endpoint uses base name, not form name (e.g. 'zygarde' not 'zygarde-50')
    // Strip known form suffixes to get base species name
    const baseName = typeof nameOrId === 'string'
        ? nameOrId
            .replace(/-50$/, '')           // zygarde-50 → zygarde
            .replace(/-altered$/, '')      // giratina-altered → giratina
            .replace(/-land$/, '')         // shaymin-land → shaymin
            .replace(/-incarnate$/, '')    // tornadus-incarnate → tornadus
            .replace(/-ordinary$/, '')     // keldeo-ordinary → keldeo
            .replace(/-aria$/, '')         // meloetta-aria → meloetta
            .replace(/-normal$/, '')       // deoxys-normal → deoxys
            .replace(/-teal$/, '')         // ogerpon-teal → ogerpon
            .replace(/-male$/, '')         // indeedee-male → indeedee
            .replace(/-midday$/, '')       // lycanroc-midday → lycanroc
            .replace(/-solo$/, '')         // wishiwashi-solo → wishiwashi
            .replace(/-amped$/, '')        // toxtricity-amped → toxtricity
            .replace(/-baile$/, '')        // oricorio-baile → oricorio
            .replace(/-standard$/, '')     // darmanitan-standard → darmanitan
            .replace(/-single-strike$/, '') // urshifu-single-strike → urshifu
        : nameOrId
    const response = await fetch(`${POKEAPI}/pokemon-species/${baseName}`)
    if (!response.ok) throw new Error(`Species not found: ${baseName}`)
    return response.json()
}

export async function getEvolutionChain(url) {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch evolution chain')
    return response.json()
}

// ── Regions ──────────────────────────────────────────────────────
export async function getRegionList() {
    const response = await fetch(`${POKEAPI}/region?limit=100`)
    if (!response.ok) throw new Error('Failed to fetch region list')
    return response.json()
}
// alias
export const getRegions = getRegionList

export async function getRegionDetail(nameOrId) {
    const response = await fetch(`${POKEAPI}/region/${nameOrId}`)
    if (!response.ok) throw new Error(`Region not found: ${nameOrId}`)
    return response.json()
}

export async function getPokedexByRegion(nameOrId) {
    const response = await fetch(`${POKEAPI}/pokedex/${nameOrId}`)
    if (!response.ok) throw new Error(`Pokédex not found: ${nameOrId}`)
    return response.json()
}

// ── Items ─────────────────────────────────────────────────────────
export async function getItemList(limit = 2200, offset = 0) {
    const response = await fetch(`${POKEAPI}/item?limit=${limit}&offset=${offset}`)
    if (!response.ok) throw new Error('Failed to fetch item list')
    return response.json()
}

export async function getItemDetail(nameOrId) {
    const response = await fetch(`${POKEAPI}/item/${nameOrId}`)
    if (!response.ok) throw new Error(`Item not found: ${nameOrId}`)
    return response.json()
}

export async function getItemCategoryList() {
    const response = await fetch(`${POKEAPI}/item-category?limit=100`)
    if (!response.ok) throw new Error('Failed to fetch item categories')
    return response.json()
}