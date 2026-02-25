import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAbilityDetail } from '../services/pokemonService'

const POKEMON_PAGE_SIZE = 20

function AbilityDetailPage() {
    const { name } = useParams()
    const [ability, setAbility] = useState(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [pokemonPage, setPokemonPage] = useState(1)

    useEffect(() => {
        const fetchAbility = async () => {
            setLoading(true)
            setSearch('')
            setPokemonPage(1)
            try {
                const data = await getAbilityDetail(name)
                setAbility(data)
            } finally {
                setLoading(false)
            }
        }
        fetchAbility()
    }, [name])

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div style={{ width: '3rem', height: '3rem', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    )

    const description = ability.effect_entries.find(e => e.language.name === 'en')?.short_effect ?? 'No description available.'
    const filtered = ability.pokemon.filter(p =>
        p.pokemon.name.includes(search.toLowerCase().trim())
    )
    const totalPages = Math.ceil(filtered.length / POKEMON_PAGE_SIZE)
    const paginated = filtered.slice((pokemonPage - 1) * POKEMON_PAGE_SIZE, pokemonPage * POKEMON_PAGE_SIZE)

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>

            <button
                onClick={() => window.history.back()}
                style={{
                    backgroundColor: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem',
                    padding: '0.45rem 1rem', cursor: 'pointer', fontWeight: '600',
                    fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex',
                    alignItems: 'center', gap: '0.4rem',
                }}
            >
                ← Back to Abilities
            </button>

            {/* Header */}
            <div style={{ backgroundColor: '#dc2626', borderRadius: '2rem', padding: '2rem', margin: '1rem 0' }}>
                <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', textTransform: 'capitalize', marginBottom: '0.75rem' }}>
                    ⚡ {ability.name.replace(/-/g, ' ')}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                    {description}
                </p>
            </div>

            {/* Pokémon with this ability */}
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
                                fontWeight: '500', display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between', border: '2px solid transparent', transition: 'all 0.2s'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.backgroundColor = '#4b5563' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.backgroundColor = '#374151' }}
                            >
                                <span>{p.pokemon.name.replace(/-/g, ' ')}</span>
                                {p.is_hidden && (
                                    <span style={{ fontSize: '0.7rem', backgroundColor: '#7c3aed', color: '#e9d5ff', padding: '0.1rem 0.4rem', borderRadius: '9999px', flexShrink: 0 }}>
                                        Hidden
                                    </span>
                                )}
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

export default AbilityDetailPage