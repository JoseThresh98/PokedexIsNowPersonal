import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAbilityDetail } from '../services/pokemonService'

const DEX = { red: '#cc2020', black: '#111111' }
const POKEMON_PAGE_SIZE = 20

function PokemonChip({ entry }) {
    const [sprite, setSprite] = useState(null)

    useEffect(() => {
        let cancelled = false
        fetch(`https://pokeapi.co/api/v2/pokemon/${entry.pokemon.name}`)
            .then(r => r.json())
            .then(d => { if (!cancelled) setSprite(d.sprites?.front_default) })
            .catch(() => { })
        return () => { cancelled = true }
    }, [entry.pokemon.name])

    return (
        <Link to={`/pokemon/${entry.pokemon.name}`} style={{ textDecoration: 'none' }}>
            <div style={{
                backgroundColor: '#374151', borderRadius: '0.75rem', padding: '0.5rem 0.75rem',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                border: '2px solid transparent', transition: 'all 0.15s', cursor: 'pointer',
            }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = DEX.red; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
                {sprite && <img src={sprite} alt={entry.pokemon.name} style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }} />}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'white', fontSize: '0.78rem', fontWeight: '600', textTransform: 'capitalize' }}>
                        {entry.pokemon.name.replace(/-/g, ' ')}
                    </span>
                    {entry.is_hidden && (
                        <span style={{ fontSize: '0.6rem', color: '#c4b5fd', fontWeight: '600' }}>Hidden</span>
                    )}
                </div>
            </div>
        </Link>
    )
}

function AbilityDetailPage() {
    const { name } = useParams()
    const navigate = useNavigate()
    const [ability, setAbility] = useState(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [pokemonPage, setPokemonPage] = useState(1)

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setSearch('')
        setPokemonPage(1)
        getAbilityDetail(name)
            .then(data => { if (!cancelled) { setAbility(data); setLoading(false) } })
            .catch(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [name])

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div style={{ width: '3rem', height: '3rem', border: `4px solid ${DEX.red}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    if (!ability) return (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#6b7280' }}>
            <p style={{ fontSize: '3rem' }}>😔</p>
            <p style={{ marginBottom: '1.5rem' }}>Ability not found.</p>
            <button onClick={() => navigate(-1)} style={{
                backgroundColor: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem', padding: '0.45rem 1rem',
                cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
            }}>← Go Back</button>
        </div>
    )

    const shortEffect = ability.effect_entries.find(e => e.language.name === 'en')?.short_effect ?? ''
    const fullEffect = ability.effect_entries.find(e => e.language.name === 'en')?.effect ?? ''
    const flavorText = ability.flavor_text_entries?.filter(e => e.language.name === 'en').pop()?.flavor_text ?? ''
    const generation = ability.generation?.name?.replace('generation-', 'Gen ').toUpperCase() ?? ''

    const filtered = ability.pokemon.filter(p => p.pokemon.name.includes(search.toLowerCase().trim()))
    const totalPages = Math.max(1, Math.ceil(filtered.length / POKEMON_PAGE_SIZE))
    const paginated = filtered.slice((pokemonPage - 1) * POKEMON_PAGE_SIZE, pokemonPage * POKEMON_PAGE_SIZE)

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem 5rem' }}>

            {/* Back */}
            <button onClick={() => navigate(-1)} style={{
                backgroundColor: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem',
                padding: '0.45rem 1rem', cursor: 'pointer', fontWeight: '600',
                fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>← Back to Abilities</button>

            {/* Hero */}
            <div style={{
                backgroundColor: DEX.red,
                border: `3px solid ${DEX.black}`,
                borderRadius: '1.5rem',
                padding: '1.5rem 2rem',
                marginBottom: '1.5rem',
                position: 'relative', overflow: 'hidden',
                boxShadow: `4px 4px 0 ${DEX.black}, 0 12px 40px rgba(0,0,0,0.4)`,
            }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.4rem' }}>
                    <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#fbbf24', border: `2px solid ${DEX.black}` }} />
                    <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#22c55e', border: `2px solid ${DEX.black}` }} />
                    <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#42b0e8', border: `2px solid ${DEX.black}` }} />
                </div>
                <svg style={{ position: 'absolute', right: '2.5rem', top: 0, height: '100%', width: '35%', opacity: 0.15, pointerEvents: 'none' }}
                    viewBox="0 0 120 80" preserveAspectRatio="none">
                    <path d="M0 60 Q30 60 40 30 L120 30" stroke={DEX.black} strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M85 30 L85 80" stroke={DEX.black} strokeWidth="3" fill="none" />
                    <circle cx="85" cy="30" r="4" fill={DEX.black} />
                </svg>

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ backgroundColor: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.85)', fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.7rem', borderRadius: '9999px' }}>
                        ⚡ Ability
                    </span>
                    {generation && (
                        <span style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.7rem', borderRadius: '9999px' }}>
                            {generation}
                        </span>
                    )}
                    <span style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.7rem', borderRadius: '9999px' }}>
                        {ability.pokemon.length} Pokémon
                    </span>
                </div>

                <h1 style={{ color: 'white', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 'bold', margin: '0 0 0.5rem', textTransform: 'capitalize', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                    {ability.name.replace(/-/g, ' ')}
                </h1>

                {flavorText && (
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                        "{flavorText.replace(/\n/g, ' ')}"
                    </p>
                )}
            </div>

            {/* Effect */}
            {(shortEffect || fullEffect) && (
                <div style={{ backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.25rem' }}>
                    <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.75rem' }}>✨ Effect</h2>
                    <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                        {fullEffect || shortEffect}
                    </p>
                </div>
            )}

            {/* Pokémon with this ability */}
            {filtered.length > 0 && (
                <div style={{ backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>
                            🎮 Pokémon with this ability ({filtered.length})
                        </h2>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            backgroundColor: '#374151', borderRadius: '9999px',
                            padding: '0.3rem 0.3rem 0.3rem 0.85rem', border: '2px solid #4b5563',
                        }}>
                            <span style={{ fontSize: '0.85rem' }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Filter Pokémon..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPokemonPage(1) }}
                                style={{ backgroundColor: 'transparent', color: 'white', border: 'none', outline: 'none', fontSize: '0.82rem', width: '130px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: totalPages > 1 ? '1.25rem' : 0 }}>
                        {paginated.map(p => <PokemonChip key={p.pokemon.name} entry={p} />)}
                    </div>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                            <button onClick={() => setPokemonPage(p => Math.max(1, p - 1))} disabled={pokemonPage === 1}
                                style={{ backgroundColor: pokemonPage === 1 ? '#374151' : DEX.red, color: 'white', border: 'none', borderRadius: '9999px', padding: '0.5rem 1.25rem', fontWeight: 'bold', cursor: pokemonPage === 1 ? 'not-allowed' : 'pointer' }}>
                                ← Prev
                            </button>
                            <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Page {pokemonPage} of {totalPages}</span>
                            <button onClick={() => setPokemonPage(p => Math.min(totalPages, p + 1))} disabled={pokemonPage === totalPages}
                                style={{ backgroundColor: pokemonPage === totalPages ? '#374151' : DEX.red, color: 'white', border: 'none', borderRadius: '9999px', padding: '0.5rem 1.25rem', fontWeight: 'bold', cursor: pokemonPage === totalPages ? 'not-allowed' : 'pointer' }}>
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default AbilityDetailPage