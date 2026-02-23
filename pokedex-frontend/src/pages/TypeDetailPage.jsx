import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTypeDetail } from '../services/pokemonService'

const typeColors = {
    fire: '#b91c1c', water: '#1d4ed8', grass: '#15803d',
    electric: '#a16207', psychic: '#be185d', ice: '#0e7490',
    dragon: '#4338ca', dark: '#1f2937', fairy: '#9d174d',
    fighting: '#7f1d1d', poison: '#6b21a8', ground: '#92400e',
    rock: '#78350f', bug: '#3f6212', ghost: '#4c1d95',
    steel: '#4b5563', flying: '#075985', normal: '#374151',
}

const typeIcons = {
    fire: '🔥', water: '💧', grass: '🌿', electric: '⚡',
    psychic: '🔮', ice: '❄️', dragon: '🐉', dark: '🌑',
    fairy: '✨', fighting: '🥊', poison: '☠️', ground: '🌍',
    rock: '🪨', bug: '🐛', ghost: '👻', steel: '⚙️',
    flying: '🌪️', normal: '⭐',
}

const POKEMON_PAGE_SIZE = 20

function TypeDetailPage() {
    const { name } = useParams()
    const [typeData, setTypeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [pokemonPage, setPokemonPage] = useState(1)

    useEffect(() => {
        const fetchType = async () => {
            setLoading(true)
            setSearch('')
            setPokemonPage(1)
            try {
                const data = await getTypeDetail(name)
                setTypeData(data)
            } finally {
                setLoading(false)
            }
        }
        fetchType()
    }, [name])

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div style={{ width: '3rem', height: '3rem', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    )

    const bgColor = typeColors[name] ?? '#374151'
    const icon = typeIcons[name] ?? '❓'
    const filtered = typeData.pokemon.filter(p =>
        p.pokemon.name.includes(search.toLowerCase().trim())
    )
    const totalPages = Math.ceil(filtered.length / POKEMON_PAGE_SIZE)
    const paginated = filtered.slice((pokemonPage - 1) * POKEMON_PAGE_SIZE, pokemonPage * POKEMON_PAGE_SIZE)

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>

            <Link to="/types" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>
                ← Back to Types
            </Link>

            {/* Hero */}
            <div style={{ backgroundColor: bgColor, borderRadius: '2rem', padding: '2rem', margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontSize: '4rem' }}>{icon}</span>
                <div>
                    <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold', textTransform: 'capitalize', margin: 0 }}>
                        {name}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.25rem 0 0' }}>
                        {typeData.pokemon.length} Pokémon with this type
                    </p>
                </div>
            </div>

            {/* Strengths / Weaknesses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '1.25rem' }}>
                    <h3 style={{ color: '#22c55e', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                        ✅ Strong Against
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {typeData.damage_relations.double_damage_to.length > 0
                            ? typeData.damage_relations.double_damage_to.map(t => (
                                <span key={t.name} style={{ backgroundColor: '#374151', color: 'white', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                                    {t.name}
                                </span>
                            ))
                            : <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>None</span>
                        }
                    </div>
                </div>
                <div style={{ backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '1.25rem' }}>
                    <h3 style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                        ❌ Weak Against
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {typeData.damage_relations.double_damage_from.length > 0
                            ? typeData.damage_relations.double_damage_from.map(t => (
                                <span key={t.name} style={{ backgroundColor: '#374151', color: 'white', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                                    {t.name}
                                </span>
                            ))
                            : <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>None</span>
                        }
                    </div>
                </div>
            </div>

            {/* Pokémon list */}
            <div style={{ backgroundColor: '#1f2937', borderRadius: '2rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>
                        Pokémon ({filtered.length})
                    </h2>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Filter..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPokemonPage(1) }}
                            style={{
                                backgroundColor: '#374151', color: 'white', border: '2px solid #4b5563',
                                borderRadius: '9999px', padding: '0.4rem 1rem 0.4rem 2.25rem',
                                fontSize: '0.85rem', outline: 'none', width: '160px'
                            }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#4b5563'}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
                    {paginated.map(p => (
                        <Link key={p.pokemon.name} to={`/pokemon/${p.pokemon.name}`} style={{ textDecoration: 'none' }}>
                            <div style={{
                                backgroundColor: '#374151', borderRadius: '1rem', padding: '0.75rem 1rem',
                                color: 'white', textTransform: 'capitalize', fontSize: '0.9rem',
                                fontWeight: '500', border: '2px solid transparent', transition: 'all 0.2s'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = bgColor; e.currentTarget.style.backgroundColor = '#4b5563' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.backgroundColor = '#374151' }}
                            >
                                {p.pokemon.name.replace(/-/g, ' ')}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {filtered.length > POKEMON_PAGE_SIZE && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                        <button
                            onClick={() => setPokemonPage(p => Math.max(1, p - 1))}
                            disabled={pokemonPage === 1}
                            style={{
                                backgroundColor: pokemonPage === 1 ? '#374151' : '#dc2626',
                                color: 'white', border: 'none', borderRadius: '9999px',
                                padding: '0.5rem 1.25rem', fontWeight: 'bold',
                                cursor: pokemonPage === 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            ← Prev
                        </button>
                        <span style={{ color: '#9ca3af' }}>Page {pokemonPage} of {totalPages}</span>
                        <button
                            onClick={() => setPokemonPage(p => Math.min(totalPages, p + 1))}
                            disabled={pokemonPage === totalPages}
                            style={{
                                backgroundColor: pokemonPage === totalPages ? '#374151' : '#dc2626',
                                color: 'white', border: 'none', borderRadius: '9999px',
                                padding: '0.5rem 1.25rem', fontWeight: 'bold',
                                cursor: pokemonPage === totalPages ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TypeDetailPage