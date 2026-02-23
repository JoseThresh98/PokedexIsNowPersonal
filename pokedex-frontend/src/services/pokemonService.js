// ── Pokémon Service ───────────────────────────────────────────────

const POKEAPI = 'https://pokeapi.co/api/v2'

// ── Pokemon List ─────────────────────────────────────────────────
export async function getPokemonList(limit = 20, offset = 0) {
  const response = await fetch(`${POKEAPI}/pokemon?limit=${limit}&offset=${offset}`)
  if (!response.ok) throw new Error('Failed to fetch Pokémon list')
  return response.json()
}

// ── Pokemon Detail ───────────────────────────────────────────────
export async function getPokemonDetail(nameOrId) {
  const response = await fetch(`${POKEAPI}/pokemon/${nameOrId}`)
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
  const response = await fetch(`${POKEAPI}/pokemon-species/${nameOrId}`)
  if (!response.ok) throw new Error(`Species not found: ${nameOrId}`)
  return response.json()
}

export async function getEvolutionChain(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch evolution chain')
  return response.json()
}
