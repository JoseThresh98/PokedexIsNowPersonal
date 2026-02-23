import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const typeColors = {
    fire: '#b91c1c', water: '#1d4ed8', grass: '#15803d', electric: '#a16207',
    psychic: '#be185d', ice: '#0e7490', dragon: '#4338ca', dark: '#1f2937',
    fairy: '#9d174d', fighting: '#7f1d1d', poison: '#6b21a8', ground: '#92400e',
    rock: '#78350f', bug: '#3f6212', ghost: '#4c1d95', steel: '#4b5563',
    flying: '#075985', normal: '#374151',
}

function getIdFromUrl(url) {
    const parts = url.replace(/\/$/, '').split('/')
    return parts[parts.length - 1]
}

function RouteDetailPage() {
    const { regionName, routeName } = useParams()
    const [pokemon, setPokemon] = useState([])
    const [loading, setLoading] = useState(true)
    const [locationName, setLocationName] = useState('')
    const [search, setSearch] = useState('')
    const [pokemonDetails, setPokemonDetails] = useState({})
    const [loadingDetails, setLoadingDetails] = useState(false)

    useEffect(() => {
        const fetchRoute = async () => {
            setLoading(true)
            setPokemon([])
            setPokemonDetails({})
            setSearch('')
            try {
                // Fetch location
                const locData = await fetch(`https://pokeapi.co/api/v2/location/${routeName}`).then(r => r.json())
                setLocationName(locData.name)

                // Fetch all areas and collect unique Pokémon with their encounter methods
                const allEncounters = {}
                for (const area of locData.areas) {
                    const areaData = await fetch(area.url).then(r => r.json())
                    areaData.pokemon_encounters.forEach(enc => {
                        const pName = enc.pokemon.name
                        const pUrl = enc.pokemon.url
                        if (!allEncounters[pName]) {
                            allEncounters[pName] = {
                                name: pName,
                                url: pUrl,
                                id: getIdFromUrl(pUrl),
                                methods: new Set()
                            }
                        }
                        enc.version_details.forEach(vd => {
                            vd.encounter_details.forEach(ed => {
                                allEncounters[pName].methods.add(ed.method.name)
                            })
                        })
                    })
                }

                const pokemonList = Object.values(allEncounters).map(p => ({
                    ...p,
                    methods: [...p.methods]
                }))

                setPokemon(pokemonList)

                // Fetch types for each Pokémon
                setLoadingDetails(true)
                const details = {}
                await Promise.all(
                    pokemonList.map(p =>
                        fetch(`https://pokeapi.co/api/v2/pokemon/${p.id}`)
                            .then(r => r.json())
                            .then(d => {
                                details[p.name] = {
                                    types: d.types.map(t => t.type.name),
                                    sprite: d.sprites?.other?.['official-artwork']?.front_default
                                        ?? d.sprites?.front_default
                                        ?? null
                                }
                            })
                            .catch(() => {
                                details[p.name] = { types: [], sprite: null }
                            })
                    )
                )
                setPokemonDetails(details)
            } finally {
                setLoading(false)
                setLoadingDetails(false)
            }
        }
        fetchRoute()
    }, [routeName])

    const filtered = pokemon.filter(p =>
        p.name.includes(search.toLowerCase().trim())
    )

    const methodLabel = (method) => {
        const labels = {
            'walk': '🌿 Grass', 'surf': '🌊 Surf', 'old-rod': '🎣 Old Rod',
            'good-rod': '🎣 Good Rod', 'super-rod': '🎣 Super Rod',
            'rock-smash': '🪨 Rock Smash', 'headbutt': '🌳 Headbutt',
            'cave': '🕳️ Cave', 'waterfall': '💧 Waterfall',
            'gift': '🎁 Gift', 'only-one': '⭐ One-time',
        }
        return labels[method] ?? `🔵 ${method.replace(/-/g, ' ')}`
    }

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem 4rem' }}>

            {/* Back links */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <Link to={`/regions/${regionName}`} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>
                    ← Back to {regionName.charAt(0).toUpperCase() + regionName.slice(1)}
                </Link>
            </div>

            {/* Hero */}
            <div style={{
                backgroundColor: '#1f2937', borderRadius: '2rem', padding: '1.5rem 2rem',
                marginBottom: '1.5rem', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
            }}>
                <div>
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '0 0 0.25rem', textTransform: 'capitalize' }}>
                        {regionName} Region
                    </p>
                    <h1 style={{
                        color: 'white', fontSize: '1.75rem', fontWeight: 'bold',
                        textTransform: 'capitalize', margin: 0
                    }}>
                        📍 {locationName.replace(/-/g, ' ')}
                    </h1>
                </div>
                {!loading && (
                    <span style={{
                        backgroundColor: '#dc2626', color: 'white', fontWeight: 'bold',
                        fontSize: '0.9rem', padding: '0.4rem 1rem', borderRadius: '9999px'
                    }}>
                        {pokemon.length} Pokémon
                    </span>
                )}
            </div>

            {/* Loading spinner */}
            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', gap: '1rem' }}>
                    <div style={{ width: '3rem', height: '3rem', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Loading route data...</p>
                </div>
            )}

            {/* Content */}
            {!loading && (
                <>
                    {/* Search */}
                    {pokemon.length > 0 && (
                        <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '1.5rem' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search Pokémon..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    width: '100%', backgroundColor: '#1f2937', color: 'white',
                                    border: '2px solid #374151', borderRadius: '9999px',
                                    padding: '0.6rem 1.25rem 0.6rem 2.75rem', fontSize: '0.95rem',
                                    outline: 'none', boxSizing: 'border-box'
                                }}
                                onFocus={e => e.target.style.borderColor = '#dc2626'}
                                onBlur={e => e.target.style.borderColor = '#374151'}
                            />
                        </div>
                    )}

                    {pokemon.length === 0 && (
                        <div style={{ backgroundColor: '#1f2937', borderRadius: '1.5rem', padding: '3rem', textAlign: 'center' }}>
                            <p style={{ color: '#6b7280' }}>No wild Pokémon data found for this location.</p>
                        </div>
                    )}

                    {/* Pokémon cards grid */}
                    {filtered.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                            {filtered.map(p => {
                                const detail = pokemonDetails[p.name]
                                return (
                                    <Link key={p.name} to={`/pokemon/${p.name}`} style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '1rem',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                            border: '2px solid transparent', transition: 'all 0.2s', cursor: 'pointer',
                                            position: 'relative'
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
                                        >
                                            {/* ID */}
                                            <span style={{ color: '#6b7280', fontSize: '0.7rem', fontFamily: 'monospace', alignSelf: 'flex-end' }}>
                                                #{String(p.id).padStart(3, '0')}
                                            </span>

                                            {/* Sprite */}
                                            {loadingDetails && !detail ? (
                                                <div style={{ width: '80px', height: '80px', backgroundColor: '#374151', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                                            ) : (
                                                <img
                                                    src={detail?.sprite ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                                                    alt={p.name}
                                                    style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}
                                                />
                                            )}

                                            {/* Name */}
                                            <p style={{ color: 'white', fontWeight: 'bold', textTransform: 'capitalize', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>
                                                {p.name.replace(/-/g, ' ')}
                                            </p>

                                            {/* Types */}
                                            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                {detail?.types?.map(type => (
                                                    <span key={type} style={{
                                                        backgroundColor: typeColors[type] ?? '#374151',
                                                        color: 'white', fontSize: '0.7rem', fontWeight: 'bold',
                                                        padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'capitalize'
                                                    }}>
                                                        {type}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Encounter methods */}
                                            {p.methods.length > 0 && (
                                                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.25rem' }}>
                                                    {p.methods.slice(0, 2).map(m => (
                                                        <span key={m} style={{
                                                            backgroundColor: '#374151', color: '#9ca3af',
                                                            fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '9999px'
                                                        }}>
                                                            {methodLabel(m)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {filtered.length === 0 && search && (
                        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                            No Pokémon found matching "{search}"
                        </p>
                    )}
                </>
            )}

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
        </div>
    )
}

export default RouteDetailPage