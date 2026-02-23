import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRegionDetail } from '../services/pokemonService'
import { regionData, regionColors, regionIcons } from '../data/regionData'

const TABS = ['overview', 'routes', 'trainers', 'legendaries']

const typeColors = {
    fire: '#b91c1c', water: '#1d4ed8', grass: '#15803d', electric: '#a16207',
    psychic: '#be185d', ice: '#0e7490', dragon: '#4338ca', dark: '#1f2937',
    fairy: '#9d174d', fighting: '#7f1d1d', poison: '#6b21a8', ground: '#92400e',
    rock: '#78350f', bug: '#3f6212', ghost: '#4c1d95', steel: '#4b5563',
    flying: '#075985', normal: '#374151',
}

const TRAINER_BASE = '/sprites/trainers/'

function RegionDetailPage() {
    const { name } = useParams()
    const [regionApiData, setRegionApiData] = useState(null)
    const [locations, setLocations] = useState([])
    const [loadingLocations, setLoadingLocations] = useState(false)
    const [tab, setTab] = useState('overview')
    const [loading, setLoading] = useState(true)
    const [expandedLocation, setExpandedLocation] = useState(null)
    const [locationPokemon, setLocationPokemon] = useState({})
    const [loadingPokemon, setLoadingPokemon] = useState(false)

    const data = regionData[name]
    const color = regionColors[name] ?? '#374151'
    const icon = regionIcons[name] ?? '🌍'

    useEffect(() => {
        const fetchRegion = async () => {
            setLoading(true)
            setTab('overview')
            setExpandedLocation(null)
            setLocationPokemon({})
            setLocations([])
            try {
                const apiData = await getRegionDetail(name)
                setRegionApiData(apiData)
            } finally {
                setLoading(false)
            }
        }
        fetchRegion()
    }, [name])

    // Fetch locations when routes tab is opened
    useEffect(() => {
        if (tab !== 'routes' || !regionApiData || locations.length > 0) return
        setLoadingLocations(true)
        Promise.all(
            regionApiData.locations.slice(0, 30).map(loc =>
                fetch(loc.url).then(r => r.json())
            )
        ).then(results => {
            setLocations(results)
            setLoadingLocations(false)
        })
    }, [tab, regionApiData])

    // Fetch pokemon for a location when expanded
    const handleLocationClick = async (location) => {
        if (expandedLocation === location.name) {
            setExpandedLocation(null)
            return
        }
        setExpandedLocation(location.name)
        if (locationPokemon[location.name]) return

        setLoadingPokemon(true)
        try {
            const areaPokemon = []
            for (const area of location.areas.slice(0, 3)) {
                const areaData = await fetch(area.url).then(r => r.json())
                areaData.pokemon_encounters.forEach(enc => {
                    if (!areaPokemon.includes(enc.pokemon.name)) {
                        areaPokemon.push(enc.pokemon.name)
                    }
                })
            }
            setLocationPokemon(prev => ({ ...prev, [location.name]: areaPokemon }))
        } finally {
            setLoadingPokemon(false)
        }
    }

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div style={{ width: '3rem', height: '3rem', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    )

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem 4rem' }}>

            <Link to="/regions" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>
                ← Back to Regions
            </Link>

            {/* Hero */}
            <div style={{ backgroundColor: color, borderRadius: '2rem', padding: '2rem', margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '3.5rem' }}>{icon}</span>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>{data?.generation}</p>
                        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold', textTransform: 'capitalize', margin: '0.1rem 0' }}>
                            {name}
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>{data?.game}</p>
                    </div>
                </div>
                {data?.description && (
                    <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>
                        {data.description}
                    </p>
                )}
            </div>

            {/* Tabs */}
            <div style={{ backgroundColor: '#1f2937', borderRadius: '2rem', overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #374151', overflowX: 'auto' }}>
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            flex: 1, padding: '0.85rem 0.5rem', border: 'none', cursor: 'pointer',
                            fontWeight: 'bold', textTransform: 'capitalize', fontSize: '0.85rem',
                            whiteSpace: 'nowrap', minWidth: '80px',
                            backgroundColor: tab === t ? color : 'transparent',
                            color: tab === t ? 'white' : '#9ca3af',
                            transition: 'all 0.2s'
                        }}>
                            {t === 'overview' ? '🗺️ Overview'
                                : t === 'routes' ? '🛤️ Routes'
                                    : t === 'trainers' ? '🏆 Trainers'
                                        : '✨ Legendaries'}
                        </button>
                    ))}
                </div>

                <div style={{ padding: '1.5rem' }}>

                    {/* ── OVERVIEW TAB ── */}
                    {tab === 'overview' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* Map */}
                            {data?.mapImage && (
                                <div style={{ textAlign: 'center' }}>
                                    <img
                                        src={data.mapImage}
                                        alt={`${name} map`}
                                        style={{ maxWidth: '100%', borderRadius: '1rem', border: `3px solid ${color}` }}
                                        onError={e => e.target.style.display = 'none'}
                                    />
                                </div>
                            )}

                            {/* Stats grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                                {[
                                    { label: 'Generation', value: data?.generation ?? '—' },
                                    { label: 'Game', value: data?.game ?? '—' },
                                    { label: 'Gyms / Trials', value: data?.gyms?.length ?? '—' },
                                    { label: 'Elite Four', value: data?.eliteFour?.length ?? '—' },
                                    { label: 'Champion', value: data?.champion?.name ?? '—' },
                                    { label: 'Legendaries', value: data?.legendaries?.length ?? '—' },
                                ].map(item => (
                                    <div key={item.label} style={{ backgroundColor: '#374151', borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
                                        <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: '0 0 0.25rem' }}>{item.label}</p>
                                        <p style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', margin: 0 }}>{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Rivals */}
                            {data?.rivals?.length > 0 && (
                                <div>
                                    <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.75rem' }}>⚔️ Rivals</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {data.rivals.map(r => (
                                            <div key={r.name} style={{
                                                backgroundColor: '#374151', borderRadius: '1rem', padding: '0.75rem 1rem',
                                                display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
                                            }}>
                                                <img
                                                    src={`${TRAINER_BASE}${r.sprite}.png`}
                                                    alt={r.name}
                                                    style={{ width: '64px', height: '64px', objectFit: 'contain', flexShrink: 0 }}
                                                    onError={e => e.target.style.display = 'none'}
                                                />
                                                <div>
                                                    <p style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>{r.name}</p>
                                                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>{r.notes}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── ROUTES TAB ── */}
                    {tab === 'routes' && (
                        <div>
                            {loadingLocations && (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                                    <div style={{ width: '2.5rem', height: '2.5rem', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                </div>
                            )}

                            {!loadingLocations && locations.length === 0 && (
                                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                                    No route data available for this region.
                                </p>
                            )}

                            {!loadingLocations && locations.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {locations.map(loc => (
                                        <Link
                                            key={loc.name}
                                            to={`/regions/${name}/routes/${loc.name}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div style={{
                                                backgroundColor: '#374151', borderRadius: '1.25rem', padding: '1.25rem',
                                                border: '2px solid transparent', transition: 'all 0.2s', cursor: 'pointer',
                                                display: 'flex', flexDirection: 'column', gap: '0.6rem',
                                                height: '100%', boxSizing: 'border-box'
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
                                            >
                                                <h3 style={{
                                                    color: 'white', fontWeight: 'bold', textTransform: 'capitalize',
                                                    fontSize: '0.95rem', margin: 0, lineHeight: '1.3'
                                                }}>
                                                    📍 {loc.name.replace(/-/g, ' ')}
                                                </h3>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                                                    <span style={{
                                                        backgroundColor: color, color: 'white', fontSize: '0.75rem',
                                                        fontWeight: 'bold', padding: '0.2rem 0.65rem', borderRadius: '9999px'
                                                    }}>
                                                        {loc.areas.length} {loc.areas.length === 1 ? 'area' : 'areas'}
                                                    </span>
                                                    <span style={{
                                                        backgroundColor: '#1f2937', color: '#9ca3af', fontSize: '0.75rem',
                                                        padding: '0.2rem 0.65rem', borderRadius: '9999px'
                                                    }}>
                                                        View Pokémon →
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── TRAINERS TAB ── */}
                    {tab === 'trainers' && data && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* Gyms */}
                            {data.gyms?.length > 0 && (
                                <div>
                                    <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                                        🏅 Gyms & Trials
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {data.gyms.map((gym, i) => (
                                            <div key={gym.city} style={{
                                                backgroundColor: '#374151', borderRadius: '1rem', padding: '0.75rem 1rem',
                                                display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
                                            }}>
                                                {/* Number badge */}
                                                <span style={{
                                                    backgroundColor: color, color: 'white', fontWeight: 'bold',
                                                    width: '1.75rem', height: '1.75rem', borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.8rem', flexShrink: 0
                                                }}>
                                                    {i + 1}
                                                </span>

                                                {/* Trainer sprite */}
                                                <img
                                                    src={`${TRAINER_BASE}${gym.sprite}.png`}
                                                    alt={gym.leader}
                                                    style={{ width: '80px', height: '80px', objectFit: 'contain', flexShrink: 0 }}
                                                    onError={e => e.target.style.display = 'none'}
                                                />

                                                {/* Info */}
                                                <div style={{ flex: 1, minWidth: '100px' }}>
                                                    <p style={{ color: 'white', fontWeight: 'bold', margin: 0, fontSize: '0.95rem' }}>{gym.leader}</p>
                                                    <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '0.1rem 0 0' }}>{gym.city}</p>
                                                </div>

                                                {/* Type + Badge */}
                                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                    {gym.type.split(' / ').map(t => (
                                                        <span key={t} style={{
                                                            backgroundColor: typeColors[t.toLowerCase().trim()] ?? '#374151',
                                                            color: 'white', fontSize: '0.75rem', padding: '0.2rem 0.6rem',
                                                            borderRadius: '9999px', textTransform: 'capitalize'
                                                        }}>
                                                            {t}
                                                        </span>
                                                    ))}
                                                    <span style={{
                                                        backgroundColor: '#1f2937', color: '#fde047',
                                                        fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '9999px'
                                                    }}>
                                                        {gym.badge}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Elite Four */}
                            {data.eliteFour?.length > 0 && (
                                <div>
                                    <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                                        💎 Elite Four
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                                        {data.eliteFour.map((e4, i) => (
                                            <div key={e4.name} style={{
                                                backgroundColor: '#374151', borderRadius: '1rem', padding: '1rem',
                                                textAlign: 'center', display: 'flex', flexDirection: 'column',
                                                alignItems: 'center', gap: '0.4rem'
                                            }}>
                                                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>#{i + 1}</p>
                                                <img
                                                    src={`${TRAINER_BASE}${e4.sprite}.png`}
                                                    alt={e4.name}
                                                    style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                                                    onError={e => e.target.style.display = 'none'}
                                                />
                                                <p style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>{e4.name}</p>
                                                <span style={{
                                                    backgroundColor: typeColors[e4.type.toLowerCase()] ?? '#1f2937',
                                                    color: 'white', fontSize: '0.75rem', padding: '0.2rem 0.6rem',
                                                    borderRadius: '9999px', textTransform: 'capitalize'
                                                }}>
                                                    {e4.type}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Champion */}
                            {data.champion && (
                                <div>
                                    <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                                        👑 Champion
                                    </h3>
                                    <div style={{
                                        backgroundColor: color, borderRadius: '1rem', padding: '1.25rem',
                                        display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap'
                                    }}>
                                        <img
                                            src={`${TRAINER_BASE}${data.champion.sprite}.png`}
                                            alt={data.champion.name}
                                            style={{ width: '100px', height: '100px', objectFit: 'contain', flexShrink: 0 }}
                                            onError={e => e.target.style.display = 'none'}
                                        />
                                        <div>
                                            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.3rem', margin: 0 }}>
                                                {data.champion.name}
                                            </p>
                                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: '0.3rem 0 0' }}>
                                                {data.champion.notes}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!data.gyms?.length && !data.eliteFour?.length && !data.champion && (
                                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                                    No trainer data available for this region.
                                </p>
                            )}
                        </div>
                    )}

                    {/* ── LEGENDARIES TAB ── */}
                    {tab === 'legendaries' && data && (
                        <div>
                            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                                {data.legendaries.length} legendary & mythical Pokémon in {name} — click to see details
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
                                {data.legendaries.map(pName => (
                                    <Link key={pName} to={`/pokemon/${pName}`} style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            backgroundColor: '#374151', borderRadius: '1rem', padding: '0.75rem 1rem',
                                            color: 'white', textTransform: 'capitalize', fontSize: '0.9rem',
                                            fontWeight: '500', border: '2px solid transparent', transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.backgroundColor = '#4b5563' }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.backgroundColor = '#374151' }}
                                        >
                                            ✨ {pName.replace(/-/g, ' ')}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {tab === 'legendaries' && !data && (
                        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                            No legendary data available for this region.
                        </p>
                    )}

                </div>
            </div>
        </div>
    )
}

export default RegionDetailPage