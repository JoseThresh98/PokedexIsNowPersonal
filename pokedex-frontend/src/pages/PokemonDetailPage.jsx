import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPokemonDetail, getPokemonSpecies, getEvolutionChain } from '../services/pokemonService'
import { getTypeColor } from '../utils/typeColors'

const typeBackgrounds = {
    fire: '#7f1d1d', water: '#1e3a5f', grass: '#14532d',
    electric: '#713f12', psychic: '#500724', ice: '#164e63',
    dragon: '#1e1b4b', dark: '#1c1917', fairy: '#4a044e',
    fighting: '#450a0a', poison: '#3b0764', ground: '#431407',
    rock: '#1c1917', bug: '#1a2e05', ghost: '#2e1065',
    steel: '#1e293b', flying: '#0c1445', normal: '#1f2937',
}

function getIdFromUrl(url) {
    const parts = url.replace(/\/$/, '').split('/')
    return parts[parts.length - 1]
}

function parseChain(chain) {
    const stages = []
    const traverse = (node, stage) => {
        const id = getIdFromUrl(node.species.url)
        stages.push({ name: node.species.name, id, stage, evolutionDetails: node.evolution_details ?? [] })
        node.evolves_to.forEach(next => traverse(next, stage + 1))
    }
    traverse(chain, 0)
    return stages
}

function getEvolutionRequirement(details) {
    if (!details || details.length === 0) return null
    const d = details[0]
    const trigger = d.trigger?.name
    if (trigger === 'level-up') {
        if (d.min_level) return `Lv. ${d.min_level}`
        if (d.min_happiness) return 'Friendship'
        if (d.min_affection) return 'Affection'
        if (d.known_move) return `Know ${d.known_move.name.replace(/-/g, ' ')}`
        if (d.known_move_type) return `Know ${d.known_move_type.name} move`
        if (d.location) return `At ${d.location.name.replace(/-/g, ' ')}`
        if (d.time_of_day) return d.time_of_day === 'day' ? '☀️ Day' : '🌙 Night'
        if (d.held_item) return `Hold ${d.held_item.name.replace(/-/g, ' ')}`
        if (d.needs_overworld_rain) return '🌧️ Rain'
        return 'Level up'
    }
    if (trigger === 'use-item' && d.item) return `Use ${d.item.name.replace(/-/g, ' ')}`
    if (trigger === 'trade') return d.held_item ? `Trade w/ ${d.held_item.name.replace(/-/g, ' ')}` : 'Trade'
    if (trigger === 'shed') return 'Shed (Lv. 20)'
    if (trigger === 'spin') return 'Spin'
    if (trigger === 'tower-of-darkness') return 'Tower of Darkness'
    if (trigger === 'tower-of-waters') return 'Tower of Waters'
    if (trigger === 'three-critical-hits') return '3 Critical Hits'
    if (trigger === 'take-damage') return 'Take Damage'
    if (trigger === 'agile-style-move') return 'Agile Style'
    if (trigger === 'strong-style-move') return 'Strong Style'
    if (trigger === 'recoil-damage') return 'Recoil Damage'
    return trigger?.replace(/-/g, ' ') ?? 'Special'
}

const statColors = {
    hp: '#dc2626', attack: '#f97316', defense: '#facc15',
    'special-attack': '#818cf8', 'special-defense': '#34d399', speed: '#f472b6'
}
const statLabels = {
    hp: 'HP', attack: 'ATK', defense: 'DEF',
    'special-attack': 'SP.ATK', 'special-defense': 'SP.DEF', speed: 'SPD'
}

// ── Pokédex palette ──────────────────────────
const DEX = {
    red: '#cc2020',
    redDark: '#a81a1a',
    black: '#111111',
    blue: '#42b0e8',
    yellow: '#fbbf24',
    green: '#22c55e',
    teal: '#14b8a6',
    gray: '#5a5a5a',
    grayDark: '#3a3a3a',
    screen: '#4b5563',
}

function PokemonDetailPage() {
    const { nameOrId } = useParams()
    const navigate = useNavigate()
    const [pokemon, setPokemon] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shiny, setShiny] = useState(false)
    const [activeTab, setActiveTab] = useState('about')
    const [evolutionChain, setEvolutionChain] = useState([])
    const [evoLoading, setEvoLoading] = useState(false)
    const [evoDetails, setEvoDetails] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setShiny(false)
            setActiveTab('about')
            setEvolutionChain([])
            setEvoDetails({})
            try {
                const data = await getPokemonDetail(nameOrId)
                setPokemon(data)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [nameOrId])

    useEffect(() => {
        if (!pokemon) return
        const fetchEvo = async () => {
            setEvoLoading(true)
            try {
                const species = await getPokemonSpecies(pokemon.name)
                const chainData = await getEvolutionChain(species.evolution_chain.url)
                const stages = parseChain(chainData.chain)
                setEvolutionChain(stages)
                const details = {}
                await Promise.all(
                    stages.map(s =>
                        fetch(`https://pokeapi.co/api/v2/pokemon/${s.id}`)
                            .then(r => r.json())
                            .then(d => {
                                details[s.name] = {
                                    types: d.types.map(t => t.type.name),
                                    sprite: d.sprites?.other?.['official-artwork']?.front_default ?? d.sprites?.front_default ?? null
                                }
                            })
                            .catch(() => { details[s.name] = { types: [], sprite: null } })
                    )
                )
                setEvoDetails(details)
            } finally {
                setEvoLoading(false)
            }
        }
        fetchEvo()
    }, [pokemon])

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div style={{ width: '3rem', height: '3rem', border: `4px solid ${DEX.red}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    )

    if (!pokemon) return (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Pokémon not found.</div>
    )

    const primaryType = pokemon.types[0]
    const bgColor = typeBackgrounds[primaryType] ?? '#1f2937'
    const currentSprite = shiny ? pokemon.shinyImageUrl : pokemon.imageUrl

    return (
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

            {/* Back button */}
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
                ← Back to Pokedex
            </button>

            {/* ════════════════════════════════════════
          POKÉDEX HERO CARD
      ════════════════════════════════════════ */}
            <div style={{
                backgroundColor: DEX.red,
                border: `3px solid ${DEX.black}`,
                borderRadius: '1.75rem',
                overflow: 'hidden',
                boxShadow: `5px 5px 0 ${DEX.black}, 0 12px 40px rgba(0,0,0,0.6)`,
                marginBottom: '1.5rem',
            }}>

                {/* ── TOP SECTION: lens + indicator dots ── */}
                <div style={{
                    padding: '0.85rem 1rem 0.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    position: 'relative',
                    borderBottom: `2px solid ${DEX.black}`,
                }}>
                    {/* Blue lens */}
                    <div style={{
                        width: '54px', height: '54px', borderRadius: '50%', flexShrink: 0,
                        background: `radial-gradient(circle at 35% 30%, #a8dcf8, ${DEX.blue} 60%, #1a6fa0)`,
                        border: `3px solid ${DEX.black}`,
                        boxShadow: `inset 0 3px 8px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.4)`,
                    }} />

                    {/* Indicator dots */}
                    <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2.5px solid ${DEX.black}`, backgroundColor: 'transparent' }} />
                        <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: DEX.yellow, border: `2.5px solid ${DEX.black}`, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                        <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: DEX.green, border: `2.5px solid ${DEX.black}`, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                    </div>

                    {/* Circuit line SVG decoration */}
                    <svg
                        style={{ position: 'absolute', right: '1rem', top: 0, height: '100%', width: '45%', opacity: 0.35, pointerEvents: 'none' }}
                        viewBox="0 0 120 70" preserveAspectRatio="none"
                    >
                        <path d="M0 50 Q25 50 35 25 L120 25" stroke={DEX.black} strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M80 25 L80 70" stroke={DEX.black} strokeWidth="3" fill="none" />
                    </svg>
                </div>

                {/* ── SCREEN SECTION ── */}
                <div style={{ padding: '0.65rem 0.75rem 0.5rem' }}>

                    {/* Screen bezel */}
                    <div style={{
                        backgroundColor: DEX.black,
                        borderRadius: '0.75rem',
                        padding: '5px',
                        border: `2px solid ${DEX.black}`,
                        boxShadow: `inset 0 2px 8px rgba(0,0,0,0.8)`,
                    }}>

                        {/* Indicator lights above screen */}
                        <div style={{ display: 'flex', gap: '0.3rem', padding: '0.3rem 0.5rem 0.2rem' }}>
                            <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: DEX.red, boxShadow: `0 0 6px ${DEX.red}` }} />
                            <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: DEX.red, boxShadow: `0 0 6px ${DEX.red}` }} />
                        </div>

                        {/* Screen content — type-colored background */}
                        <div style={{
                            backgroundColor: bgColor,
                            borderRadius: '0.4rem',
                            padding: '1rem 1rem 1rem 1.1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            minHeight: '150px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Subtle radial glow behind sprite */}
                            <div style={{
                                position: 'absolute', right: '-10px', top: '-10px',
                                width: '160px', height: '160px', borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                                pointerEvents: 'none'
                            }} />

                            {/* Left: ID + Name + Types */}
                            <div style={{ flex: 1, zIndex: 1 }}>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: '0.75rem', margin: '0 0 0.15rem' }}>
                                    #{String(pokemon.id).padStart(3, '0')}
                                </p>
                                <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 'bold', textTransform: 'capitalize', margin: '0 0 0.65rem', textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                                    {pokemon.name}
                                </h1>
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    {pokemon.types.map(type => (
                                        <span key={type} className={`${getTypeColor(type)} text-white text-sm font-bold px-4 py-1 rounded-full capitalize`}>
                                            {type}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Sprite */}
                            <img
                                src={currentSprite}
                                alt={pokemon.name}
                                onClick={() => setShiny(s => !s)}
                                style={{
                                    width: '125px', height: '125px', objectFit: 'contain',
                                    filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.6))',
                                    cursor: 'pointer', flexShrink: 0, zIndex: 1,
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                            />
                        </div>

                        {/* Sub-screen bar: red dot + lines */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.35rem 0.6rem', backgroundColor: '#1a1a1a',
                            borderRadius: '0 0 0.4rem 0.4rem',
                        }}>
                            <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: DEX.red, boxShadow: `0 0 5px ${DEX.red}` }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                {[28, 22, 28, 18].map((w, i) => (
                                    <div key={i} style={{ width: `${w}px`, height: '2px', backgroundColor: '#444', borderRadius: '1px' }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM CONTROLS BAR ── */}
                <div style={{
                    backgroundColor: DEX.redDark,
                    borderTop: `2px solid ${DEX.black}`,
                    padding: '0.6rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                }}>

                    {/* Gray joystick */}
                    <div style={{
                        width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: DEX.gray,
                        border: `2.5px solid ${DEX.black}`,
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                    }} />

                    {/* Red + teal pill buttons */}
                    <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                        <div style={{ width: '34px', height: '11px', borderRadius: '9999px', backgroundColor: '#dc2626', border: `1.5px solid ${DEX.black}` }} />
                        <div style={{ width: '34px', height: '11px', borderRadius: '9999px', backgroundColor: DEX.teal, border: `1.5px solid ${DEX.black}` }} />
                    </div>

                    {/* Shiny toggle — styled as the green rectangle button */}
                    <button
                        onClick={() => setShiny(s => !s)}
                        style={{
                            flex: 1,
                            backgroundColor: shiny ? DEX.yellow : DEX.green,
                            color: shiny ? DEX.black : 'white',
                            border: `2.5px solid ${DEX.black}`,
                            borderRadius: '0.45rem',
                            padding: '0.3rem 0.5rem',
                            fontWeight: 'bold', fontSize: '0.75rem',
                            cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: `0 2px 0 ${DEX.black}`,
                        }}
                    >
                        ✨ {shiny ? 'Shiny' : 'Normal'}
                    </button>

                    {/* D-pad */}
                    <div style={{ position: 'relative', width: '38px', height: '38px', flexShrink: 0 }}>
                        {/* Vertical bar */}
                        <div style={{ position: 'absolute', left: '33%', top: 0, width: '34%', height: '100%', backgroundColor: DEX.grayDark, borderRadius: '3px', border: `1.5px solid ${DEX.black}` }} />
                        {/* Horizontal bar */}
                        <div style={{ position: 'absolute', top: '33%', left: 0, width: '100%', height: '34%', backgroundColor: DEX.grayDark, borderRadius: '3px', border: `1.5px solid ${DEX.black}` }} />
                        {/* Center circle */}
                        <div style={{ position: 'absolute', left: '30%', top: '30%', width: '40%', height: '40%', backgroundColor: DEX.gray, borderRadius: '50%' }} />
                    </div>
                </div>
            </div>
            {/* ════════════════════════════════════════ */}

            {/* TABS */}
            <div style={{ backgroundColor: '#1f2937', borderRadius: '2rem', overflow: 'hidden', marginBottom: '1.5rem', border: `2px solid ${DEX.black}` }}>
                <div style={{ display: 'flex', borderBottom: `2px solid ${DEX.black}` }}>
                    {['about', 'stats', 'abilities'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            flex: 1, padding: '0.85rem 0.5rem', border: 'none', cursor: 'pointer',
                            fontWeight: 'bold', textTransform: 'capitalize', fontSize: '0.9rem',
                            backgroundColor: activeTab === tab ? DEX.red : 'transparent',
                            color: activeTab === tab ? 'white' : '#9ca3af',
                            transition: 'all 0.2s',
                            borderRight: tab !== 'abilities' ? `2px solid ${DEX.black}` : 'none',
                        }}>
                            {tab === 'about' ? '📋 About' : tab === 'stats' ? '📊 Stats' : '⚡ Abilities'}
                        </button>
                    ))}
                </div>

                <div style={{ padding: '1.25rem' }}>

                    {/* About */}
                    {activeTab === 'about' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { label: 'Height', value: `${pokemon.height / 10} m` },
                                { label: 'Weight', value: `${pokemon.weight / 10} kg` },
                                { label: 'Base XP', value: pokemon.baseExperience ?? '—' },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.5rem', borderBottom: '1px solid #374151' }}>
                                    <span style={{ color: '#9ca3af' }}>{row.label}</span>
                                    <span style={{ color: 'white', fontWeight: 'bold' }}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stats */}
                    {activeTab === 'stats' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {pokemon.stats.map(stat => (
                                <div key={stat.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                        <span style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            {statLabels[stat.name] ?? stat.name.toUpperCase()}
                                        </span>
                                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{stat.value}</span>
                                    </div>
                                    <div style={{ backgroundColor: '#374151', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', borderRadius: '9999px',
                                            width: `${(stat.value / 255) * 100}%`,
                                            backgroundColor: statColors[stat.name] ?? DEX.red,
                                            transition: 'width 0.6s ease'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Abilities */}
                    {activeTab === 'abilities' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {pokemon.abilities.map(ability => (
                                <div key={ability.name} style={{
                                    backgroundColor: '#374151', borderRadius: '1rem', padding: '0.85rem 1rem',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    border: `1px solid ${DEX.black}`
                                }}>
                                    <span style={{ color: 'white', fontWeight: '600', textTransform: 'capitalize' }}>
                                        {ability.name.replace(/-/g, ' ')}
                                    </span>
                                    {ability.isHidden && (
                                        <span style={{ backgroundColor: '#7c3aed', color: '#e9d5ff', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                                            Hidden
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* EVOLUTION CHAIN */}
            <div style={{ backgroundColor: '#1f2937', borderRadius: '2rem', padding: '1.5rem', border: `2px solid ${DEX.black}` }}>
                <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1.25rem' }}>
                    🔄 Evolution Chain
                </h2>

                {evoLoading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <div style={{ width: '2rem', height: '2rem', border: `3px solid ${DEX.red}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    </div>
                )}

                {!evoLoading && evolutionChain.length <= 1 && (
                    <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>
                        This Pokémon does not evolve.
                    </p>
                )}

                {!evoLoading && evolutionChain.length > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                        {evolutionChain.map((evo, index) => {
                            const detail = evoDetails[evo.name]
                            const isCurrentPokemon = evo.name === pokemon.name
                            const req = getEvolutionRequirement(evo.evolutionDetails)

                            return (
                                <div key={evo.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {index > 0 && evo.stage > evolutionChain[index - 1]?.stage && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                                            {req && (
                                                <span style={{
                                                    backgroundColor: '#374151', color: DEX.yellow,
                                                    fontSize: '0.65rem', fontWeight: 'bold', padding: '0.15rem 0.5rem',
                                                    borderRadius: '9999px', whiteSpace: 'nowrap', textTransform: 'capitalize',
                                                    border: `1px solid ${DEX.black}`
                                                }}>
                                                    {req}
                                                </span>
                                            )}
                                            <span style={{ color: '#9ca3af', fontSize: '1.2rem' }}>→</span>
                                        </div>
                                    )}
                                    <div
                                        onClick={() => !isCurrentPokemon && navigate(`/pokemon/${evo.name}`)}
                                        style={{
                                            backgroundColor: isCurrentPokemon ? (typeBackgrounds[detail?.types?.[0]] ?? '#374151') : '#374151',
                                            borderRadius: '1.25rem', padding: '0.75rem',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                                            border: isCurrentPokemon ? `2px solid ${DEX.red}` : `2px solid transparent`,
                                            cursor: isCurrentPokemon ? 'default' : 'pointer',
                                            transition: 'all 0.2s', minWidth: '90px'
                                        }}
                                        onMouseEnter={e => { if (!isCurrentPokemon) { e.currentTarget.style.borderColor = DEX.red; e.currentTarget.style.transform = 'translateY(-3px)' } }}
                                        onMouseLeave={e => { if (!isCurrentPokemon) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' } }}
                                    >
                                        <span style={{ color: '#6b7280', fontSize: '0.65rem', fontFamily: 'monospace' }}>
                                            #{String(evo.id).padStart(3, '0')}
                                        </span>
                                        {detail?.sprite
                                            ? <img src={detail.sprite} alt={evo.name} style={{ width: '64px', height: '64px', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }} />
                                            : <div style={{ width: '64px', height: '64px', backgroundColor: '#4b5563', borderRadius: '50%' }} />
                                        }
                                        <p style={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'capitalize', margin: 0, textAlign: 'center' }}>
                                            {evo.name.replace(/-/g, ' ')}
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                            {detail?.types?.map(type => (
                                                <span key={type} className={`${getTypeColor(type)} text-white capitalize`} style={{ fontSize: '0.6rem', fontWeight: 'bold', padding: '0.1rem 0.4rem', borderRadius: '9999px' }}>
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                        {isCurrentPokemon && (
                                            <span style={{ backgroundColor: DEX.red, color: 'white', fontSize: '0.6rem', fontWeight: 'bold', padding: '0.1rem 0.5rem', borderRadius: '9999px' }}>
                                                Current
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

        </div>
    )
}

export default PokemonDetailPage