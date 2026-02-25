import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const DEX = { red: '#cc2020', black: '#111111' }

const typeColors = {
    fire: '#b91c1c', water: '#1d4ed8', grass: '#15803d', electric: '#a16207',
    psychic: '#be185d', ice: '#0e7490', dragon: '#4338ca', dark: '#1f2937',
    fairy: '#9d174d', fighting: '#7f1d1d', poison: '#6b21a8', ground: '#92400e',
    rock: '#78350f', bug: '#3f6212', ghost: '#4c1d95', steel: '#4b5563',
    flying: '#075985', normal: '#374151',
}

function getCategoryColor(categoryName) {
    if (!categoryName) return '#6b7280'
    const name = categoryName.toLowerCase()
    if (name.includes('ball')) return '#f59e0b'
    if (name.includes('machine') || name.includes('tm') || name.includes('tr')) return '#06b6d4'
    if (name.includes('berry')) return '#22c55e'
    if (name.includes('key') || name.includes('event') || name.includes('plot')) return '#f97316'
    if (name.includes('medicine') || name.includes('heal') || name.includes('vitamin') || name.includes('revival')) return '#ec4899'
    if (name.includes('battle')) return '#ef4444'
    return '#6366f1'
}

function StatChip({ label, value, color = '#374151' }) {
    return (
        <div style={{
            backgroundColor: '#1f2937',
            border: `2px solid ${color}40`,
            borderRadius: '0.85rem',
            padding: '0.75rem 1rem',
            display: 'flex', flexDirection: 'column', gap: '0.2rem',
            minWidth: '100px',
        }}>
            <span style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textTransform: 'capitalize' }}>{value || '—'}</span>
        </div>
    )
}

function HolderCard({ pokemon }) {
    const [sprite, setSprite] = useState(null)

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            .then(r => r.json())
            .then(d => setSprite(
                d.sprites?.other?.['official-artwork']?.front_default ||
                d.sprites?.front_default || null
            ))
            .catch(() => { })
    }, [pokemon.name])

    return (
        <Link to={`/pokemon/${pokemon.name}`} style={{ textDecoration: 'none' }}>
            <div style={{
                backgroundColor: '#1f2937', borderRadius: '0.85rem', padding: '0.75rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
                border: '2px solid transparent', cursor: 'pointer', transition: 'all 0.18s',
            }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = DEX.red; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
                {sprite
                    ? <img src={sprite} alt={pokemon.name} style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
                    : <div style={{ width: '56px', height: '56px', backgroundColor: '#374151', borderRadius: '50%' }} />
                }
                <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize', textAlign: 'center' }}>
                    {pokemon.name.replace(/-/g, ' ')}
                </span>
            </div>
        </Link>
    )
}

export default function ItemDetailPage() {
    const { name } = useParams()
    const navigate = useNavigate()
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(false)
        fetch(`https://pokeapi.co/api/v2/item/${name}`)
            .then(r => { if (!r.ok) throw new Error(); return r.json() })
            .then(data => {
                const enEffect = data.effect_entries?.find(e => e.language.name === 'en')
                const enFlavor = data.flavor_text_entries?.filter(e => e.language.name === 'en') || []
                const enName = data.names?.find(n => n.language.name === 'en')

                setItem({
                    id: data.id,
                    name: data.name,
                    displayName: enName?.name || data.name,
                    category: data.category,
                    cost: data.cost,
                    sprite: data.sprites?.default,
                    effect: enEffect?.effect || '',
                    shortEffect: enEffect?.short_effect || '',
                    flavorText: enFlavor[enFlavor.length - 1]?.text?.replace(/\n/g, ' ') || '',
                    attributes: data.attributes || [],
                    heldByPokemon: data.held_by_pokemon || [],
                    machines: data.machines || [],
                    flingPower: data.fling_power,
                    flingEffect: data.fling_effect,
                })
                setLoading(false)
            })
            .catch(() => { setError(true); setLoading(false) })
    }, [name])

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ width: '3rem', height: '3rem', border: `4px solid ${DEX.red}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    if (error || !item) return (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#6b7280' }}>
            <p style={{ fontSize: '3rem' }}>😔</p>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Item "{name}" not found</p>
            <button onClick={() => navigate('/items')} style={{ backgroundColor: DEX.red, color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.6rem 1.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                ← Back to Items
            </button>
        </div>
    )

    const categoryColor = getCategoryColor(item.category?.name)

    return (
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem 5rem' }}>

            {/* Back link */}
            <button
                onClick={() => navigate('/items')}
                style={{
                    backgroundColor: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem',
                    padding: '0.45rem 1rem', cursor: 'pointer', fontWeight: '600',
                    fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex',
                    alignItems: 'center', gap: '0.4rem',
                }}
            >
                ← Back to Items
            </button>

            {/* ── Main card ── */}
            <div style={{
                backgroundColor: '#111827',
                border: `3px solid ${DEX.black}`,
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: `4px 4px 0 ${DEX.black}, 0 20px 60px rgba(0,0,0,0.5)`,
                marginBottom: '1.5rem',
            }}>

                {/* Header band */}
                <div style={{
                    backgroundColor: categoryColor,
                    padding: '1.5rem 2rem',
                    display: 'flex', alignItems: 'center', gap: '1.5rem',
                    flexWrap: 'wrap',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Circuit decoration */}
                    <svg style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '35%', opacity: 0.15, pointerEvents: 'none' }}
                        viewBox="0 0 120 80" preserveAspectRatio="none">
                        <path d="M0 60 Q30 60 40 30 L120 30" stroke={DEX.black} strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M85 30 L85 80" stroke={DEX.black} strokeWidth="3" fill="none" />
                        <circle cx="85" cy="30" r="4" fill={DEX.black} />
                    </svg>

                    {/* Sprite circle */}
                    <div style={{
                        width: '96px', height: '96px', flexShrink: 0,
                        backgroundColor: 'rgba(0,0,0,0.25)',
                        borderRadius: '50%',
                        border: `3px solid rgba(255,255,255,0.3)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {item.sprite
                            ? <img src={item.sprite} alt={item.displayName} style={{ width: '64px', height: '64px', imageRendering: 'pixelated', objectFit: 'contain' }} />
                            : <span style={{ fontSize: '2.5rem' }}>🎒</span>
                        }
                    </div>

                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>
                            #{String(item.id).padStart(4, '0')} · {item.category?.name?.replace(/-/g, ' ') || 'Item'}
                        </p>
                        <h1 style={{ color: 'white', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 'bold', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                            {item.displayName}
                        </h1>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

                    {/* Stats row */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <StatChip label="Cost" value={item.cost > 0 ? `₽${item.cost.toLocaleString()}` : 'Not sold'} color={categoryColor} />
                        <StatChip label="Category" value={item.category?.name?.replace(/-/g, ' ')} color={categoryColor} />
                        {item.flingPower && <StatChip label="Fling Power" value={item.flingPower} color={categoryColor} />}
                        {item.attributes?.length > 0 && (
                            <div style={{
                                backgroundColor: '#1f2937', border: `2px solid ${categoryColor}40`,
                                borderRadius: '0.85rem', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem',
                            }}>
                                <span style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Attributes</span>
                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                                    {item.attributes.map(a => (
                                        <span key={a.name} style={{
                                            backgroundColor: categoryColor + '25', color: categoryColor,
                                            border: `1px solid ${categoryColor}50`,
                                            borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '600',
                                            padding: '0.15rem 0.5rem', textTransform: 'capitalize',
                                        }}>
                                            {a.name.replace(/-/g, ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Effect */}
                    {item.effect && (
                        <div>
                            <h2 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: categoryColor }}>✦</span> Effect
                            </h2>
                            <p style={{ color: '#d1d5db', lineHeight: 1.7, backgroundColor: '#1f2937', borderRadius: '0.85rem', padding: '1rem', margin: 0, borderLeft: `3px solid ${categoryColor}` }}>
                                {item.effect}
                            </p>
                        </div>
                    )}

                    {/* Flavor text */}
                    {item.flavorText && (
                        <div>
                            <h2 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: categoryColor }}>✦</span> In-Game Description
                            </h2>
                            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontStyle: 'italic', backgroundColor: '#1f2937', borderRadius: '0.85rem', padding: '1rem', margin: 0, borderLeft: `3px solid rgba(156,163,175,0.4)` }}>
                                "{item.flavorText}"
                            </p>
                        </div>
                    )}

                    {/* Fling effect */}
                    {item.flingEffect?.name && (
                        <div>
                            <h2 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: categoryColor }}>✦</span> Fling Effect
                            </h2>
                            <p style={{ color: '#d1d5db', lineHeight: 1.7, backgroundColor: '#1f2937', borderRadius: '0.85rem', padding: '0.75rem 1rem', margin: 0, textTransform: 'capitalize' }}>
                                {item.flingEffect.name.replace(/-/g, ' ')}
                            </p>
                        </div>
                    )}

                    {/* Held by Pokémon */}
                    {item.heldByPokemon?.length > 0 && (
                        <div>
                            <h2 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: categoryColor }}>✦</span> Held by Pokémon
                                <span style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 'normal' }}>({item.heldByPokemon.length})</span>
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.6rem' }}>
                                {item.heldByPokemon.map(h => (
                                    <HolderCard key={h.pokemon.name} pokemon={h.pokemon} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Learnable moves (machines) */}
                    {item.machines?.length > 0 && (
                        <div>
                            <h2 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: categoryColor }}>✦</span> Teaches Move
                            </h2>
                            <p style={{ color: '#d1d5db', backgroundColor: '#1f2937', borderRadius: '0.85rem', padding: '0.75rem 1rem', margin: 0, textTransform: 'capitalize' }}>
                                {item.machines[0]?.move?.name?.replace(/-/g, ' ') || '—'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}