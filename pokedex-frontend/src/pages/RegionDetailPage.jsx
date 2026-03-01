import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { getRegionDetail } from '../services/pokemonService'
import { regionData, regionColors, regionIcons } from '../data/regionData'
import { nameToTrainerId } from '../data/trainerIdMap'
import { trainerData } from '../data/trainerData'

const TABS = ['overview', 'routes', 'trainers', 'legendaries']

const typeColors = {
    fire: '#b91c1c', water: '#1d4ed8', grass: '#15803d', electric: '#a16207',
    psychic: '#be185d', ice: '#0e7490', dragon: '#4338ca', dark: '#1f2937',
    fairy: '#9d174d', fighting: '#7f1d1d', poison: '#6b21a8', ground: '#92400e',
    rock: '#78350f', bug: '#3f6212', ghost: '#4c1d95', steel: '#4b5563',
    flying: '#075985', normal: '#374151',
}

function TrainerCard({ name, children, color }) {
    const trainerId = nameToTrainerId[name]
    const sprite = trainerId ? trainerData[trainerId]?.sprite : null

    const inner = (
        <div
            style={{
                backgroundColor: '#374151', borderRadius: '1rem', padding: '0.65rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap',
                border: '2px solid transparent', transition: 'all 0.18s',
                cursor: trainerId ? 'pointer' : 'default',
            }}
            onMouseEnter={e => { if (trainerId) { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateX(4px)' } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateX(0)' }}
        >
            {sprite && (
                <img src={sprite} alt={name} onError={e => { e.target.style.display = 'none' }}
                    style={{ height: '52px', width: 'auto', objectFit: 'contain', flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
                />
            )}
            {children}
            {trainerId && (
                <span style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.8rem', flexShrink: 0 }}>View →</span>
            )}
        </div>
    )

    return trainerId
        ? <Link to={`/trainer/${trainerId}`} style={{ textDecoration: 'none' }}>{inner}</Link>
        : inner
}

const RIVAL_SPRITES = {
    'blue': 'blue.png', 'silver': 'silver.png', 'brendan': 'brendan.png', 'may': 'may.png',
    'barry': 'barry.png', 'cheren': 'cheren.png', 'bianca': 'bianca.png', 'n': 'n.png',
    'serena': 'serena.png', 'calem': 'calem.png', 'shauna': 'shauna.png',
    'tierno': 'tierno.png', 'trevor': 'trevor.png', 'hau': 'hau.png', 'gladion': 'gladion.png',
    'hop': 'hop.png', 'bede': 'bede.png', 'marnie': 'marnie.png',
    'nemona': 'nemona.png', 'arven': 'arven.png', 'penny': 'penny.png',
    'rei': 'rei.png', 'akari': 'akari.png', 'volo': 'volo.png',
}

const FORM_OVERRIDES = {
    'giratina': 'giratina-altered', 'shaymin': 'shaymin-land',
    'tornadus': 'tornadus-incarnate', 'thundurus': 'thundurus-incarnate',
    'landorus': 'landorus-incarnate', 'keldeo': 'keldeo-ordinary',
    'meloetta': 'meloetta-aria', 'basculin': 'basculin-red-striped',
    'darmanitan': 'darmanitan-standard', 'zygarde': 'zygarde-50',
    'oricorio': 'oricorio-baile', 'lycanroc': 'lycanroc-midday',
    'wishiwashi': 'wishiwashi-solo', 'minior': 'minior-red-meteor',
    'mimikyu': 'mimikyu-disguised', 'toxtricity': 'toxtricity-amped',
    'eiscue': 'eiscue-ice', 'indeedee': 'indeedee-male',
    'morpeko': 'morpeko-full-belly', 'urshifu': 'urshifu-single-strike',
    'calyrex': 'calyrex', 'enamorus': 'enamorus-incarnate',
    'deoxys': 'deoxys-normal', 'necrozma': 'necrozma',
    'tapu-koko': 'tapu-koko', 'tapu-lele': 'tapu-lele',
    'tapu-bulu': 'tapu-bulu', 'tapu-fini': 'tapu-fini', 'hoopa': 'hoopa',
    'zacian': 'zacian', 'zamazenta': 'zamazenta', 'kubfu': 'kubfu',
    'wo-chien': 'wo-chien', 'chien-pao': 'chien-pao',
    'ting-lu': 'ting-lu', 'chi-yu': 'chi-yu',
    'ogerpon': 'ogerpon-teal', 'terapagos': 'terapagos-normal',
}

function LegendaryCard({ name, color, index = 0 }) {
    const [data, setData] = useState(null)

    useEffect(() => {
        let cancelled = false
        const apiName = FORM_OVERRIDES[name] || name
        const timer = setTimeout(() => {
            if (cancelled) return
            fetch(`https://pokeapi.co/api/v2/pokemon/${apiName}`)
                .then(r => { if (!r.ok) throw new Error('not found'); return r.json() })
                .then(d => {
                    if (!cancelled) setData({
                        id: d.id,
                        types: d.types.map(t => t.type.name),
                        sprite: d.sprites?.other?.['official-artwork']?.front_default || d.sprites?.front_default || null,
                    })
                })
                .catch(() => { if (!cancelled) setData({ id: null, types: [], sprite: null }) })
        }, index * 80)
        return () => { cancelled = true; clearTimeout(timer) }
    }, [name, index])

    return (
        <Link to={`/pokemon/${name}`} style={{ textDecoration: 'none' }}>
            <div style={{
                backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '0.85rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
                border: '2px solid transparent', transition: 'all 0.2s', cursor: 'pointer',
                minHeight: '150px', justifyContent: 'center',
            }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${color}44` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
                {data ? (
                    <>
                        {data.id && (
                            <span style={{ color: '#6b7280', fontSize: '0.6rem', fontFamily: 'monospace', alignSelf: 'flex-end' }}>
                                #{String(data.id).padStart(3, '0')}
                            </span>
                        )}
                        {data.sprite
                            ? <img src={data.sprite} alt={name} style={{ width: '75px', height: '75px', objectFit: 'contain', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))' }} />
                            : <div style={{ width: '75px', height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🔴</div>
                        }
                        <p style={{ color: 'white', fontWeight: 'bold', textTransform: 'capitalize', fontSize: '0.75rem', margin: 0, textAlign: 'center', lineHeight: '1.2' }}>
                            {name.replace(/-/g, ' ')}
                        </p>
                        <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {data.types.map(t => (
                                <span key={t} style={{
                                    backgroundColor: typeColors[t] ?? '#374151', color: 'white',
                                    fontSize: '0.6rem', fontWeight: 'bold', padding: '0.1rem 0.4rem',
                                    borderRadius: '9999px', textTransform: 'capitalize',
                                }}>{t}</span>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ width: '75px', height: '75px', backgroundColor: '#374151', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                        <div style={{ width: '60px', height: '8px', backgroundColor: '#374151', borderRadius: '4px', marginTop: '0.4rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    </>
                )}
            </div>
        </Link>
    )
}

function RegionDetailPage() {
    const { name } = useParams()
    const navigate = useNavigate()
    const routerLocation = useLocation()

    const [regionApiData, setRegionApiData] = useState(null)
    const [locations, setLocations] = useState([])
    const [loadingLocations, setLoadingLocations] = useState(false)
    const [tab, setTab] = useState(routerLocation.state?.tab || 'overview')
    const [loading, setLoading] = useState(true)

    const data = regionData[name]
    const color = regionColors[name] ?? '#374151'
    const icon = regionIcons[name] ?? '🌍'

    useEffect(() => {
        const run = async () => {
            setLoading(true)
            setTab(routerLocation.state?.tab || 'overview')
            try {
                const apiData = await getRegionDetail(name)
                setRegionApiData(apiData)
            } finally {
                setLoading(false)
            }
        }
        run()
    }, [name])

    useEffect(() => {
        if (tab !== 'routes' || !regionApiData || locations.length > 0) return
        setLoadingLocations(true)
        Promise.all(
            regionApiData.locations.slice(0, 30).map(loc => fetch(loc.url).then(r => r.json()))
        ).then(results => {
            setLocations(results)
            setLoadingLocations(false)
        })
    }, [tab, regionApiData])

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div style={{ width: '3rem', height: '3rem', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    )

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem 4rem' }}>
            <button
                onClick={() => navigate('/regions')}
                style={{
                    backgroundColor: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem',
                    padding: '0.45rem 1rem', cursor: 'pointer', fontWeight: '600',
                    fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex',
                    alignItems: 'center', gap: '0.4rem',
                }}
            >
                ← Back to Regions
            </button>

            {/* Hero */}
            <div style={{
                backgroundColor: color, borderRadius: '2rem', padding: '2rem',
                margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '3.5rem' }}>{icon}</span>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>{data?.generation}</p>
                        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold', textTransform: 'capitalize', margin: '0.1rem 0' }}>{name}</h1>
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
                            transition: 'all 0.2s',
                        }}>
                            {t === 'overview' ? '🗺️ Overview' : t === 'routes' ? '🛤️ Routes' : t === 'trainers' ? '🏆 Trainers' : '✨ Legendaries'}
                        </button>
                    ))}
                </div>

                <div style={{ padding: '1.5rem' }}>

                    {/* OVERVIEW TAB */}
                    {tab === 'overview' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {data?.mapImage && (
                                <div style={{ textAlign: 'center' }}>
                                    <img src={data.mapImage} alt={`${name} map`}
                                        style={{ maxWidth: '100%', borderRadius: '1rem', border: `3px solid ${color}` }}
                                        onError={e => e.target.style.display = 'none'} />
                                </div>
                            )}
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
                            {data?.rivals?.length > 0 && (
                                <div>
                                    <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.75rem' }}>⚔️ Rivals</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {data.rivals.map(r => {
                                            const rivalSprite = RIVAL_SPRITES[r.name.toLowerCase().replace(/[^a-z]/g, '')]
                                                || RIVAL_SPRITES[r.name.toLowerCase().split(' ')[0]]
                                            return (
                                                <div key={r.name} style={{ backgroundColor: '#374151', borderRadius: '1rem', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                                                    {rivalSprite && (
                                                        <img
                                                            src={`https://play.pokemonshowdown.com/sprites/trainers/${rivalSprite}`}
                                                            alt={r.name}
                                                            style={{ width: '48px', height: '48px', objectFit: 'contain', imageRendering: 'pixelated', flexShrink: 0 }}
                                                            onError={e => e.target.style.display = 'none'}
                                                        />
                                                    )}
                                                    <div style={{ flex: 1 }}>
                                                        <span style={{ color: 'white', fontWeight: 'bold', display: 'block' }}>{r.name}</span>
                                                        <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{r.notes}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ROUTES TAB */}
                    {tab === 'routes' && (
                        <div>
                            {loadingLocations && (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                                    <div style={{ width: '2.5rem', height: '2.5rem', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                </div>
                            )}
                            {!loadingLocations && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {locations.length === 0 && (
                                        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No route data available for this region.</p>
                                    )}
                                    {locations.map((loc, i) => (
                                        <Link key={loc.name} to={`/regions/${name}/routes/${loc.name}`} style={{ textDecoration: 'none' }}>
                                            <div style={{
                                                backgroundColor: '#374151', borderRadius: '1rem',
                                                padding: '0.9rem 1.1rem',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                border: '2px solid transparent', transition: 'all 0.18s',
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.backgroundColor = '#3f4b5e' }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.backgroundColor = '#374151' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <span style={{
                                                        backgroundColor: color + '30', color: color,
                                                        border: `1px solid ${color}60`, borderRadius: '0.5rem',
                                                        padding: '0.2rem 0.5rem', fontSize: '0.7rem',
                                                        fontWeight: '700', minWidth: '32px', textAlign: 'center',
                                                    }}>
                                                        {String(i + 1).padStart(2, '0')}
                                                    </span>
                                                    <span style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem', textTransform: 'capitalize' }}>
                                                        📍 {loc.name.replace(/-/g, ' ')}
                                                    </span>
                                                </div>
                                                <span style={{ color: color, fontSize: '0.85rem', fontWeight: '700' }}>View →</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TRAINERS TAB */}
                    {tab === 'trainers' && data && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {data.gyms?.length > 0 && (
                                <div>
                                    <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '1.1rem' }}>🏅 Gyms & Trials</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {data.gyms.map((gym, i) => (
                                            <TrainerCard key={gym.city} name={gym.leader.split(' / ')[0]} color={color}>
                                                <span style={{
                                                    backgroundColor: color, color: 'white', fontWeight: 'bold',
                                                    width: '1.75rem', height: '1.75rem', borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.8rem', flexShrink: 0,
                                                }}>{i + 1}</span>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ color: 'white', fontWeight: 'bold', margin: 0, fontSize: '0.95rem' }}>{gym.leader}</p>
                                                    <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '0.1rem 0 0' }}>{gym.city}</p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                                    {gym.type.split(' / ').map(t => (
                                                        <span key={t} style={{
                                                            backgroundColor: typeColors[t.toLowerCase()] ?? '#374151',
                                                            color: 'white', fontSize: '0.75rem', padding: '0.2rem 0.6rem',
                                                            borderRadius: '9999px', textTransform: 'capitalize',
                                                        }}>{t}</span>
                                                    ))}
                                                    <span style={{ backgroundColor: '#1f2937', color: '#fde047', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                                                        {gym.badge}
                                                    </span>
                                                </div>
                                            </TrainerCard>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.eliteFour?.length > 0 && (
                                <div>
                                    <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '1.1rem' }}>💎 Elite Four</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {data.eliteFour.map((e4, i) => (
                                            <TrainerCard key={e4.name} name={e4.name} color={color}>
                                                <span style={{ color: '#9ca3af', fontSize: '0.85rem', width: '1.5rem', flexShrink: 0 }}>#{i + 1}</span>
                                                <p style={{ color: 'white', fontWeight: 'bold', margin: 0, flex: 1 }}>{e4.name}</p>
                                                <span style={{
                                                    backgroundColor: typeColors[e4.type.toLowerCase()] ?? '#1f2937',
                                                    color: 'white', fontSize: '0.75rem', padding: '0.2rem 0.6rem',
                                                    borderRadius: '9999px', textTransform: 'capitalize',
                                                }}>{e4.type}</span>
                                            </TrainerCard>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.champion && (
                                <div>
                                    <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '1.1rem' }}>👑 Champion</h3>
                                    <TrainerCard name={data.champion.name.split(' / ')[0]} color={color}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>{data.champion.name}</p>
                                            <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>{data.champion.notes}</p>
                                        </div>
                                        <span style={{
                                            backgroundColor: color, color: 'white', fontSize: '0.75rem', fontWeight: 'bold',
                                            padding: '0.2rem 0.7rem', borderRadius: '9999px',
                                        }}>Champion</span>
                                    </TrainerCard>
                                </div>
                            )}
                        </div>
                    )}

                    {/* LEGENDARIES TAB */}
                    {tab === 'legendaries' && data && (
                        <div>
                            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                                {data.legendaries.length} legendary & mythical Pokémon in {name} — click to see details
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem' }}>
                                {data.legendaries.map((pName, i) => (
                                    <LegendaryCard key={pName} name={pName} color={color} index={i} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
            `}</style>
        </div>
    )
}

export default RegionDetailPage