import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const DEX = { red: '#cc2020', black: '#111111' }

const TYPE_COLORS = {
    normal: '#6b7280', fire: '#dc2626', water: '#2563eb', grass: '#16a34a',
    electric: '#ca8a04', ice: '#0891b2', fighting: '#b91c1c', poison: '#7c3aed',
    ground: '#92400e', flying: '#0284c7', psychic: '#db2777', bug: '#65a30d',
    rock: '#78716c', ghost: '#6d28d9', dragon: '#4338ca', dark: '#1f2937',
    steel: '#475569', fairy: '#be185d',
}

const TYPE_ICONS = {
    normal: '⭐', fire: '🔥', water: '💧', grass: '🌿', electric: '⚡',
    ice: '❄️', fighting: '🥊', poison: '☠️', ground: '🌍', flying: '🦅',
    psychic: '🔮', bug: '🐛', rock: '🪨', ghost: '👻', dragon: '🐉',
    dark: '🌑', steel: '⚙️', fairy: '🌸',
}

const DAMAGE_COLORS = {
    physical: '#b91c1c',
    special: '#1d4ed8',
    status: '#374151',
}

function StatBar({ label, value, max, color }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '600', width: '80px', flexShrink: 0 }}>{label}</span>
            <div style={{ flex: 1, backgroundColor: '#374151', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                <div style={{
                    width: `${Math.min(100, (value / max) * 100)}%`,
                    height: '100%', backgroundColor: color, borderRadius: '9999px',
                    transition: 'width 0.6s ease',
                }} />
            </div>
            <span style={{ color: 'white', fontWeight: '700', fontSize: '0.85rem', width: '40px', textAlign: 'right' }}>
                {value ?? '—'}
            </span>
        </div>
    )
}

function PokemonChip({ pokemon }) {
    const [sprite, setSprite] = useState(null)

    useEffect(() => {
        let cancelled = false
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            .then(r => r.json())
            .then(d => { if (!cancelled) setSprite(d.sprites?.front_default) })
            .catch(() => { })
        return () => { cancelled = true }
    }, [pokemon.name])

    return (
        <Link to={`/pokemon/${pokemon.name}`} style={{ textDecoration: 'none' }}>
            <div style={{
                backgroundColor: '#374151', borderRadius: '0.75rem', padding: '0.5rem 0.75rem',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                border: '2px solid transparent', transition: 'all 0.15s', cursor: 'pointer',
            }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = DEX.red; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
                {sprite && <img src={sprite} alt={pokemon.name} style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }} />}
                <span style={{ color: 'white', fontSize: '0.78rem', fontWeight: '600', textTransform: 'capitalize' }}>
                    {pokemon.name.replace(/-/g, ' ')}
                </span>
            </div>
        </Link>
    )
}

export default function MoveDetailPage() {
    const { name } = useParams()
    const navigate = useNavigate()
    const [move, setMove] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        let cancelled = false
        fetch(`https://pokeapi.co/api/v2/move/${name}`)
            .then(r => { if (!r.ok) throw new Error(); return r.json() })
            .then(d => {
                if (cancelled) return
                setMove({
                    name: d.name,
                    type: d.type?.name,
                    damageClass: d.damage_class?.name,
                    power: d.power,
                    accuracy: d.accuracy,
                    pp: d.pp,
                    priority: d.priority,
                    effect: d.effect_entries?.find(e => e.language.name === 'en')?.effect || '',
                    shortEffect: d.effect_entries?.find(e => e.language.name === 'en')?.short_effect || '',
                    flavorText: d.flavor_text_entries?.filter(e => e.language.name === 'en').pop()?.flavor_text || '',
                    target: d.target?.name?.replace(/-/g, ' '),
                    generation: d.generation?.name?.replace('generation-', 'Gen ').toUpperCase(),
                    learnedBy: d.learned_by_pokemon?.slice(0, 40) || [],
                    meta: d.meta,
                })
                setLoading(false)
            })
            .catch(() => { if (!cancelled) { setError(true); setLoading(false) } })
        return () => { cancelled = true }
    }, [name])

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ width: '3rem', height: '3rem', border: `4px solid ${DEX.red}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    if (error) return (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#6b7280' }}>
            <p style={{ fontSize: '3rem' }}>😔</p>
            <p style={{ marginBottom: '1.5rem' }}>Move not found.</p>
            <button onClick={() => navigate(-1)} style={{
                backgroundColor: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem', padding: '0.45rem 1rem',
                cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
            }}>← Go Back</button>
        </div>
    )

    const typeColor = TYPE_COLORS[move.type] || DEX.red
    const dmgColor = DAMAGE_COLORS[move.damageClass] || DAMAGE_COLORS.status
    const typeIcon = TYPE_ICONS[move.type] || '💥'

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem 5rem' }}>

            {/* Back */}
            <button onClick={() => navigate(-1)} style={{
                backgroundColor: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem',
                padding: '0.45rem 1rem', cursor: 'pointer', fontWeight: '600',
                fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>← Back</button>

            {/* Hero */}
            <div style={{
                backgroundColor: typeColor,
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
                    <span style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.7rem', borderRadius: '9999px', textTransform: 'capitalize' }}>
                        {typeIcon} {move.type}
                    </span>
                    <span style={{ backgroundColor: dmgColor, color: 'white', fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.7rem', borderRadius: '9999px', textTransform: 'capitalize' }}>
                        {move.damageClass}
                    </span>
                    {move.generation && (
                        <span style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.7rem', borderRadius: '9999px' }}>
                            {move.generation}
                        </span>
                    )}
                </div>

                <h1 style={{ color: 'white', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 'bold', margin: '0 0 0.25rem', textTransform: 'capitalize', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                    {move.name.replace(/-/g, ' ')}
                </h1>
                {move.flavorText && (
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                        "{move.flavorText.replace(/\n/g, ' ')}"
                    </p>
                )}
            </div>

            {/* Stats */}
            <div style={{ backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.25rem' }}>
                <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1.25rem' }}>📊 Move Stats</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <StatBar label="Power" value={move.power} max={250} color={typeColor} />
                    <StatBar label="Accuracy" value={move.accuracy} max={100} color={typeColor} />
                    <StatBar label="PP" value={move.pp} max={40} color={typeColor} />
                </div>

                {/* Info pills */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
                    {[
                        { label: 'Target', value: move.target },
                        { label: 'Priority', value: move.priority !== undefined ? (move.priority > 0 ? `+${move.priority}` : move.priority) : null },
                        { label: 'Crit Rate', value: move.meta?.crit_rate !== undefined ? move.meta.crit_rate : null },
                        { label: 'Flinch', value: move.meta?.flinch_chance ? `${move.meta.flinch_chance}%` : null },
                        { label: 'Ailment', value: move.meta?.ailment?.name !== 'none' ? move.meta?.ailment?.name : null },
                    ].filter(i => i.value !== null && i.value !== undefined && i.value !== '').map(info => (
                        <div key={info.label} style={{ backgroundColor: '#374151', borderRadius: '0.75rem', padding: '0.5rem 1rem' }}>
                            <p style={{ color: '#9ca3af', fontSize: '0.7rem', margin: '0 0 0.15rem', fontWeight: '600', textTransform: 'uppercase' }}>{info.label}</p>
                            <p style={{ color: 'white', fontWeight: '700', fontSize: '0.85rem', margin: 0, textTransform: 'capitalize' }}>{info.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Effect */}
            {move.effect && (
                <div style={{ backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.25rem' }}>
                    <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.75rem' }}>✨ Effect</h2>
                    <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                        {move.effect.replace(/\$effect_chance/g, move.meta?.effect_chance ?? '?')}
                    </p>
                </div>
            )}

            {/* Learned by */}
            {move.learnedBy.length > 0 && (
                <div style={{ backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '1.5rem' }}>
                    <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem' }}>
                        🎮 Learned by {move.learnedBy.length >= 40 ? '40+' : move.learnedBy.length} Pokémon
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {move.learnedBy.map(p => (
                            <PokemonChip key={p.name} pokemon={p} />
                        ))}
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}