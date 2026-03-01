import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const DEX = { red: '#cc2020', black: '#111111' }

const typeColors = {
    fire: '#b91c1c', water: '#1d4ed8', grass: '#15803d', electric: '#a16207',
    psychic: '#be185d', ice: '#0e7490', dragon: '#4338ca', dark: '#374151',
    fairy: '#9d174d', fighting: '#7f1d1d', poison: '#6b21a8', ground: '#92400e',
    rock: '#78350f', bug: '#3f6212', ghost: '#4c1d95', steel: '#4b5563',
    flying: '#075985', normal: '#4b5563',
}

const METHOD_LABELS = {
    'walk': { label: 'Walking', icon: '🌿' },
    'old-rod': { label: 'Old Rod', icon: '🎣' },
    'good-rod': { label: 'Good Rod', icon: '🎣' },
    'super-rod': { label: 'Super Rod', icon: '🎣' },
    'surf': { label: 'Surfing', icon: '🌊' },
    'rock-smash': { label: 'Rock Smash', icon: '🪨' },
    'headbutt': { label: 'Headbutt', icon: '🌳' },
    'headbutt-dark': { label: 'Headbutt (Dark)', icon: '🌲' },
    'headbutt-normal': { label: 'Headbutt', icon: '🌳' },
    'gift': { label: 'Gift', icon: '🎁' },
    'only-one': { label: 'One-Time', icon: '⭐' },
    'pokeflute': { label: 'Poké Flute', icon: '🎵' },
    'slot2-ruby': { label: 'Slot 2 (Ruby)', icon: '💎' },
    'slot2-sapphire': { label: 'Slot 2 (Sapphire)', icon: '💙' },
    'grass-spots': { label: 'Shaking Grass', icon: '✨' },
    'dark-grass': { label: 'Dark Grass', icon: '🌑' },
    'cave-spots': { label: 'Shaking Cave', icon: '✨' },
    'bridge-spots': { label: 'Shaking Bridge', icon: '✨' },
    'rough-terrain': { label: 'Rough Terrain', icon: '🏔️' },
    'fishing-spots': { label: 'Rippling Water', icon: '✨' },
}

function getMethodInfo(method) {
    return METHOD_LABELS[method] || { label: method.replace(/-/g, ' '), icon: '📍' }
}

// Color for encounter rate bar
function getRateColor(chance) {
    if (chance >= 20) return '#22c55e'
    if (chance >= 10) return '#f59e0b'
    if (chance >= 5) return '#f97316'
    return '#ef4444'
}

function PokemonEncounterCard({ encounter, regionColor }) {
    const [pokemonData, setPokemonData] = useState(null)

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${encounter.name}`)
            .then(r => r.json())
            .then(d => setPokemonData({
                id: d.id,
                types: d.types.map(t => t.type.name),
                sprite: d.sprites?.other?.['official-artwork']?.front_default || d.sprites?.front_default || null,
            }))
            .catch(() => { })
    }, [encounter.name])

    const maxChance = Math.max(...encounter.methods.map(m => m.chance))
    const minLevel = Math.min(...encounter.methods.flatMap(m => [m.minLevel, m.maxLevel]))
    const maxLevel = Math.max(...encounter.methods.flatMap(m => [m.minLevel, m.maxLevel]))

    return (
        <Link to={`/pokemon/${encounter.name}`} style={{ textDecoration: 'none' }}>
            <div
                style={{
                    backgroundColor: '#1f2937',
                    borderRadius: '1.1rem',
                    overflow: 'hidden',
                    border: '2px solid transparent',
                    transition: 'all 0.18s',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = regionColor; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
                {/* Encounter rate bar at top */}
                <div style={{ height: '4px', backgroundColor: '#374151' }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.min(100, maxChance * 2.5)}%`,
                        backgroundColor: getRateColor(maxChance),
                        transition: 'width 0.5s ease',
                    }} />
                </div>

                <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Sprite */}
                    <div style={{
                        width: '80px', height: '80px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {pokemonData?.sprite
                            ? <img src={pokemonData.sprite} alt={encounter.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                            : <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#374151', animation: 'pulse 1.5s ease-in-out infinite' }} />
                        }
                    </div>

                    {/* Dex number */}
                    {pokemonData?.id && (
                        <span style={{ color: '#6b7280', fontSize: '0.68rem', fontWeight: '700' }}>
                            #{String(pokemonData.id).padStart(3, '0')}
                        </span>
                    )}

                    {/* Name */}
                    <span style={{
                        color: 'white', fontWeight: '700', fontSize: '0.82rem',
                        textTransform: 'capitalize', textAlign: 'center', lineHeight: 1.2,
                    }}>
                        {encounter.name.replace(/-/g, ' ')}
                    </span>

                    {/* Types */}
                    {pokemonData?.types && (
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {pokemonData.types.map(t => (
                                <span key={t} style={{
                                    backgroundColor: typeColors[t] || '#374151',
                                    color: 'white', fontSize: '0.62rem', fontWeight: '700',
                                    padding: '0.15rem 0.45rem', borderRadius: '9999px',
                                    textTransform: 'capitalize',
                                }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Level range */}
                    <span style={{ color: '#9ca3af', fontSize: '0.72rem' }}>
                        Lv. {minLevel}{minLevel !== maxLevel ? `–${maxLevel}` : ''}
                    </span>

                    {/* Encounter chance */}
                    <div style={{
                        backgroundColor: getRateColor(maxChance) + '20',
                        border: `1px solid ${getRateColor(maxChance)}50`,
                        borderRadius: '9999px',
                        padding: '0.15rem 0.6rem',
                        fontSize: '0.7rem', fontWeight: '700',
                        color: getRateColor(maxChance),
                    }}>
                        {maxChance}% chance
                    </div>

                    {/* Method icons */}
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[...new Set(encounter.methods.map(m => m.method))].map(method => {
                            const info = getMethodInfo(method)
                            return (
                                <span key={method} title={info.label} style={{
                                    backgroundColor: '#374151', borderRadius: '0.4rem',
                                    padding: '0.1rem 0.4rem', fontSize: '0.65rem', color: '#9ca3af',
                                }}>
                                    {info.icon} {info.label}
                                </span>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default function RouteDetailPage() {
    const { regionName, routeName } = useParams()
    const navigate = useNavigate()
    const [areas, setAreas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [locationName, setLocationName] = useState('')
    const [activeArea, setActiveArea] = useState(null)

    useEffect(() => {
        setLoading(true)
        setError(false)

        fetch(`https://pokeapi.co/api/v2/location/${routeName}`)
            .then(r => { if (!r.ok) throw new Error(); return r.json() })
            .then(async locationData => {
                setLocationName(
                    locationData.names?.find(n => n.language.name === 'en')?.name ||
                    routeName.replace(/-/g, ' ')
                )

                // Fetch all areas in parallel
                const areaResults = await Promise.all(
                    locationData.areas.map(area =>
                        fetch(area.url).then(r => r.json())
                    )
                )

                // Process each area: group encounters by pokemon + method
                const processedAreas = areaResults.map(area => {
                    const encounterMap = {}

                    area.pokemon_encounters.forEach(enc => {
                        const name = enc.pokemon.name
                        if (!encounterMap[name]) encounterMap[name] = { name, methods: [] }

                        enc.version_details.forEach(vd => {
                            vd.encounter_details.forEach(ed => {
                                encounterMap[name].methods.push({
                                    method: ed.method.name,
                                    chance: ed.chance,
                                    minLevel: ed.min_level,
                                    maxLevel: ed.max_level,
                                })
                            })
                        })
                    })

                    // Deduplicate methods, keep highest chance per method
                    const encounters = Object.values(encounterMap).map(enc => {
                        const methodMap = {}
                        enc.methods.forEach(m => {
                            const key = m.method
                            if (!methodMap[key] || m.chance > methodMap[key].chance) {
                                methodMap[key] = m
                            }
                        })
                        return { ...enc, methods: Object.values(methodMap) }
                    })

                    // Sort by highest encounter chance
                    encounters.sort((a, b) =>
                        Math.max(...b.methods.map(m => m.chance)) -
                        Math.max(...a.methods.map(m => m.chance))
                    )

                    return {
                        name: area.name,
                        displayName: area.names?.find(n => n.language.name === 'en')?.name ||
                            area.name.replace(/-/g, ' ').replace(routeName.replace(/-/g, ' '), '').trim() ||
                            'Area',
                        encounters,
                    }
                }).filter(a => a.encounters.length > 0)

                setAreas(processedAreas)
                if (processedAreas.length > 0) setActiveArea(processedAreas[0].name)
                setLoading(false)
            })
            .catch(() => { setError(true); setLoading(false) })
    }, [routeName])

    // Region color map (matches RegionDetailPage)
    const regionColors = {
        kanto: '#dc2626', johto: '#7c3aed', hoenn: '#2563eb',
        sinnoh: '#0891b2', unova: '#374151', kalos: '#db2777',
        alola: '#d97706', galar: '#16a34a', paldea: '#9333ea', hisui: '#b45309',
    }
    const color = regionColors[regionName] || DEX.red

    const activeAreaData = areas.find(a => a.name === activeArea)

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ width: '3rem', height: '3rem', border: `4px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    if (error) return (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#6b7280' }}>
            <p style={{ fontSize: '3rem' }}>😔</p>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>No encounter data found for this route.</p>
            <button onClick={() => navigate(`/regions/${regionName}`, { state: { tab: 'routes' } })} style={{
                backgroundColor: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem',
                padding: '0.45rem 1rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
            }}>
                ← Back to {regionName.charAt(0).toUpperCase() + regionName.slice(1)}
            </button>
        </div>
    )

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem 5rem' }}>

            {/* Back button */}
            <button
                onClick={() => navigate(`/regions/${regionName}`, { state: { tab: 'routes' } })}
                style={{
                    backgroundColor: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem',
                    padding: '0.45rem 1rem', cursor: 'pointer', fontWeight: '600',
                    fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex',
                    alignItems: 'center', gap: '0.4rem',
                }}
            >
                ← Back to {regionName.charAt(0).toUpperCase() + regionName.slice(1)}
            </button>

            {/* ── Hero header ── */}
            <div style={{
                backgroundColor: color,
                border: `3px solid ${DEX.black}`,
                borderRadius: '1.5rem',
                padding: '1.5rem 2rem',
                marginBottom: '1.5rem',
                position: 'relative', overflow: 'hidden',
                boxShadow: `4px 4px 0 ${DEX.black}, 0 12px 40px rgba(0,0,0,0.4)`,
            }}>
                {/* Traffic lights */}
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.4rem' }}>
                    <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#fbbf24', border: `2px solid ${DEX.black}` }} />
                    <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#22c55e', border: `2px solid ${DEX.black}` }} />
                    <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#42b0e8', border: `2px solid ${DEX.black}` }} />
                </div>
                {/* Circuit decoration */}
                <svg style={{ position: 'absolute', right: '2.5rem', top: 0, height: '100%', width: '35%', opacity: 0.15, pointerEvents: 'none' }}
                    viewBox="0 0 120 80" preserveAspectRatio="none">
                    <path d="M0 60 Q30 60 40 30 L120 30" stroke={DEX.black} strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M85 30 L85 80" stroke={DEX.black} strokeWidth="3" fill="none" />
                    <circle cx="85" cy="30" r="4" fill={DEX.black} />
                </svg>

                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>
                    {regionName.charAt(0).toUpperCase() + regionName.slice(1)} · Wild Encounters
                </p>
                <h1 style={{ color: 'white', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 'bold', margin: '0 0 0.4rem', textTransform: 'capitalize', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                    📍 {locationName}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0 }}>
                    {areas.reduce((sum, a) => sum + a.encounters.length, 0)} Pokémon across {areas.length} area{areas.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* ── Area tabs (if multiple) ── */}
            {areas.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {areas.map(area => (
                        <button
                            key={area.name}
                            onClick={() => setActiveArea(area.name)}
                            style={{
                                padding: '0.45rem 1rem',
                                borderRadius: '9999px',
                                border: `2px solid ${activeArea === area.name ? DEX.black : 'rgba(255,255,255,0.15)'}`,
                                backgroundColor: activeArea === area.name ? color : 'rgba(0,0,0,0.35)',
                                color: 'white', fontWeight: activeArea === area.name ? '700' : '500',
                                fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s',
                                textTransform: 'capitalize',
                                boxShadow: activeArea === area.name ? `2px 2px 0 ${DEX.black}` : 'none',
                            }}
                        >
                            {area.displayName || area.name.replace(/-/g, ' ')}
                            <span style={{ marginLeft: '0.4rem', opacity: 0.75, fontSize: '0.75rem' }}>
                                ({area.encounters.length})
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* ── Encounter legend ── */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
                <span style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600' }}>ENCOUNTER RATE:</span>
                {[['≥20%', '#22c55e'], ['≥10%', '#f59e0b'], ['≥5%', '#f97316'], ['<5%', '#ef4444']].map(([label, c]) => (
                    <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#d1d5db' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c, flexShrink: 0 }} />
                        {label}
                    </span>
                ))}
            </div>

            {/* ── Encounters grid ── */}
            {activeAreaData && (
                activeAreaData.encounters.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                        <p>No encounter data available for this area.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))',
                        gap: '0.85rem',
                    }}>
                        {activeAreaData.encounters.map(enc => (
                            <PokemonEncounterCard
                                key={enc.name}
                                encounter={enc}
                                regionColor={color}
                            />
                        ))}
                    </div>
                )
            )}

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
        </div>
    )
}