export const typeColors = {
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    grass: 'bg-green-500',
    electric: 'bg-yellow-400',
    psychic: 'bg-pink-500',
    ice: 'bg-cyan-400',
    dragon: 'bg-indigo-600',
    dark: 'bg-gray-800',
    fairy: 'bg-pink-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    rock: 'bg-yellow-800',
    bug: 'bg-lime-500',
    ghost: 'bg-purple-800',
    steel: 'bg-gray-400',
    flying: 'bg-sky-400',
    normal: 'bg-gray-400',
}

export function getTypeColor(type) {
    return typeColors[type] ?? 'bg-gray-400'
}