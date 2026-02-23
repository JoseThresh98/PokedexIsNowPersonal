import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// ── Pokédex palette ──────────────────────────
const DEX = {
    red: '#cc2020', redDark: '#a81a1a', black: '#111111',
    blue: '#42b0e8', yellow: '#fbbf24', green: '#22c55e',
    teal: '#14b8a6', gray: '#5a5a5a',
}

const typeColors = {
    fire: '#b91c1c', water: '#1d4ed8', grass: '#15803d', electric: '#a16207',
    psychic: '#be185d', ice: '#0e7490', dragon: '#4338ca', dark: '#1f2937',
    fairy: '#9d174d', fighting: '#7f1d1d', poison: '#6b21a8', ground: '#92400e',
    rock: '#78350f', bug: '#3f6212', ghost: '#4c1d95', steel: '#4b5563',
    flying: '#075985', normal: '#374151',
}

// ── Category definitions ─────────────────────
const CATEGORIES = [
    {
        id: 'legendary',
        label: 'Legendary',
        icon: '👑',
        color: '#f59e0b',
        glow: 'rgba(245,158,11,0.3)',
        description: 'Immensely powerful Pokémon enshrined in legend',
        pokemon: [
            'articuno', 'zapdos', 'moltres', 'mewtwo',
            'raikou', 'entei', 'suicune', 'lugia', 'ho-oh',
            'regirock', 'regice', 'registeel', 'latias', 'latios', 'kyogre', 'groudon', 'rayquaza',
            'uxie', 'mesprit', 'azelf', 'dialga', 'palkia', 'heatran', 'regigigas', 'giratina', 'cresselia',
            'cobalion', 'terrakion', 'virizion', 'tornadus', 'thundurus', 'reshiram', 'zekrom', 'landorus', 'kyurem',
            'xerneas', 'yveltal', 'zygarde',
            'tapu-koko', 'tapu-lele', 'tapu-bulu', 'tapu-fini', 'cosmog', 'cosmoem', 'solgaleo', 'lunala', 'necrozma',
            'zacian', 'zamazenta', 'eternatus', 'kubfu', 'urshifu', 'regieleki', 'regidrago', 'glastrier', 'spectrier', 'calyrex',
            'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu', 'koraidon', 'miraidon', 'ogerpon', 'terapagos',
        ],
    },
    {
        id: 'mythical',
        label: 'Mythical',
        icon: '✨',
        color: '#a855f7',
        glow: 'rgba(168,85,247,0.3)',
        description: 'Extremely rare Pokémon passed down through mythology',
        pokemon: [
            'mew', 'celebi', 'jirachi', 'deoxys', 'phione', 'manaphy', 'darkrai', 'shaymin', 'arceus',
            'victini', 'keldeo', 'meloetta', 'genesect',
            'diancie', 'hoopa', 'volcanion',
            'magearna', 'marshadow', 'zeraora', 'meltan', 'melmetal',
            'zarude',
            'pecharunt',
        ],
    },
    {
        id: 'ultra-beast',
        label: 'Ultra Beasts',
        icon: '🌀',
        color: '#06b6d4',
        glow: 'rgba(6,182,212,0.3)',
        description: 'Mysterious beings from Ultra Space with overwhelming power',
        pokemon: [
            'nihilego', 'buzzwole', 'pheromosa', 'xurkitree', 'celesteela', 'kartana', 'guzzlord',
            'poipole', 'naganadel', 'stakataka', 'blacephalon',
        ],
    },
    {
        id: 'paradox',
        label: 'Paradox',
        icon: '⏳',
        color: '#f97316',
        glow: 'rgba(249,115,22,0.3)',
        description: 'Ancient past forms and distant future constructs from Paldea',
        pokemon: [
            // Past
            'great-tusk', 'scream-tail', 'brute-bonnet', 'flutter-mane', 'slither-wing',
            'sandy-shocks', 'roaring-moon', 'walking-wake', 'gouging-fire', 'raging-bolt',
            // Future
            'iron-treads', 'iron-bundle', 'iron-hands', 'iron-jugulis', 'iron-moth',
            'iron-thorns', 'iron-valiant', 'iron-leaves', 'iron-boulder', 'iron-crown',
        ],
    },
]

// ── Individual card ──────────────────────────
function PokemonCard({ name, categoryColor, categoryGlow }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(r => r.json())
            .then(d => {
                setData({
                    id: d.id,
                    types: d.types.map(t => t.type.name),
                    sprite: d.sprites?.other?.['official-artwork']?.front_default
                        ?? d.sprites?.front_default ?? null,
                })
            })
            .catch(() => setData(null))
            .finally(() => setLoading(false))
    }, [name])

    if (loading) return (
        <div style={{
            backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '1rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            minHeight: '160px', justifyContent: 'center',
            animation: 'pulse 1.5s ease-in-out infinite',
        }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#374151', borderRadius: '50%' }} />
            <div style={{ width: '60px', height: '10px', backgroundColor: '#374151', borderRadius: '4px' }} />
        </div>
    )

    if (!data) return null

    return (
        <Link to={`/pokemon/${name}`} style={{ textDecoration: 'none' }}>
            <div
                style={{
                    backgroundColor: '#1f2937',
                    borderRadius: '1.25rem',
                    padding: '1rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                    border: '2px solid transparent',
                    transition: 'all 0.22s',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    userSelect: 'none',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = categoryColor
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = `0 8px 24px ${categoryGlow}`
                    e.currentTarget.style.backgroundColor = '#263244'
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'transparent'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.backgroundColor = '#1f2937'
                }}
            >
                {/* Glow behind sprite */}
                <div style={{
                    position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
                    width: '70px', height: '70px', borderRadius: '50%',
                    background: `radial-gradient(circle, ${categoryGlow} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }} />

                <span style={{ color: '#6b7280', fontSize: '0.65rem', fontFamily: 'monospace', alignSelf: 'flex-end', position: 'relative', zIndex: 1 }}>
                    #{String(data.id).padStart(3, '0')}
                </span>

                <img
                    src={data.sprite}
                    alt={name}
                    style={{
                        width: '80px', height: '80px', objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                        position: 'relative', zIndex: 1,
                    }}
                />

                <p style={{
                    color: 'white', fontWeight: 'bold', textTransform: 'capitalize',
                    fontSize: '0.8rem', margin: 0, textAlign: 'center',
                    lineHeight: '1.2',
                }}>
                    {name.replace(/-/g, ' ')}
                </p>

                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {data.types.map(type => (
                        <span key={type} style={{
                            backgroundColor: typeColors[type] ?? '#374151',
                            color: 'white', fontSize: '0.65rem', fontWeight: 'bold',
                            padding: '0.15rem 0.45rem', borderRadius: '9999px', textTransform: 'capitalize',
                        }}>
                            {type}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    )
}

// ── Category section ─────────────────────────
function CategorySection({ category, isVisible }) {
    if (!isVisible) return null
    return (
        <div style={{ marginBottom: '2.5rem' }}>
            {/* Section header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                marginBottom: '1.25rem', paddingBottom: '0.75rem',
                borderBottom: `2px solid ${category.color}22`,
            }}>
                <div style={{
                    width: '42px', height: '42px', borderRadius: '0.85rem',
                    backgroundColor: `${category.color}22`,
                    border: `2px solid ${category.color}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', flexShrink: 0,
                }}>
                    {category.icon}
                </div>
                <div>
                    <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>
                        {category.label}{' '}
                        <span style={{
                            backgroundColor: `${category.color}33`,
                            color: category.color, fontSize: '0.75rem',
                            fontWeight: 'bold', padding: '0.1rem 0.55rem',
                            borderRadius: '9999px', marginLeft: '0.4rem',
                            verticalAlign: 'middle',
                        }}>
                            {category.pokemon.length}
                        </span>
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>
                        {category.description}
                    </p>
                </div>
            </div>

            {/* Cards grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '0.85rem',
            }}>
                {category.pokemon.map(name => (
                    <PokemonCard
                        key={name}
                        name={name}
                        categoryColor={category.color}
                        categoryGlow={category.glow}
                    />
                ))}
            </div>
        </div>
    )
}

// ── Main page ────────────────────────────────
function RarityPage() {
    const [activeFilter, setActiveFilter] = useState('all')
    const [search, setSearch] = useState('')

    const filters = [
        { id: 'all', label: 'All', icon: '🌟' },
        ...CATEGORIES.map(c => ({ id: c.id, label: c.label, icon: c.icon, color: c.color })),
    ]

    const totalCount = CATEGORIES.reduce((sum, c) => sum + c.pokemon.length, 0)

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem 5rem' }}>

            {/* ── Page hero ── */}
            <div style={{
                backgroundColor: DEX.red,
                border: `3px solid ${DEX.black}`,
                borderRadius: '1.75rem',
                padding: '1.75rem 2rem',
                marginBottom: '1.75rem',
                boxShadow: `4px 4px 0 ${DEX.black}, 0 12px 40px rgba(204,32,32,0.3)`,
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative dots */}
                <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', display: 'flex', gap: '0.4rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: DEX.yellow, border: `2px solid ${DEX.black}` }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: DEX.green, border: `2px solid ${DEX.black}` }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: DEX.blue, border: `2px solid ${DEX.black}` }} />
                </div>

                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: '0 0 0.3rem', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Pokédex 2.0
                </p>
                <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.4rem' }}>
                    🌟 Rare Pokémon
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: '0 0 1.25rem' }}>
                    {totalCount} extraordinary Pokémon across 4 categories
                </p>

                {/* Search */}
                <div style={{ position: 'relative', maxWidth: '380px' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search rare Pokémon..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', backgroundColor: 'rgba(0,0,0,0.35)',
                            color: 'white', border: `2px solid rgba(255,255,255,0.25)`,
                            borderRadius: '9999px', padding: '0.6rem 1.25rem 0.6rem 2.75rem',
                            fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                        }}
                        onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.7)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.25)'}
                    />
                </div>
            </div>

            {/* ── Filter tabs ── */}
            <div style={{
                display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
                marginBottom: '1.75rem',
            }}>
                {filters.map(f => (
                    <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        style={{
                            padding: '0.5rem 1.1rem',
                            border: `2px solid ${activeFilter === f.id ? (f.color ?? DEX.red) : '#374151'}`,
                            borderRadius: '9999px', cursor: 'pointer', fontWeight: 'bold',
                            fontSize: '0.85rem', transition: 'all 0.18s',
                            backgroundColor: activeFilter === f.id ? (f.color ?? DEX.red) : '#1f2937',
                            color: 'white',
                            boxShadow: activeFilter === f.id ? `0 4px 12px ${f.color ?? DEX.red}55` : 'none',
                            outline: 'none', userSelect: 'none',
                        }}
                    >
                        {f.icon} {f.label}
                    </button>
                ))}
            </div>

            {/* ── Category sections ── */}
            {CATEGORIES.map(category => {
                // Apply search filter
                const filteredCategory = search.trim()
                    ? { ...category, pokemon: category.pokemon.filter(n => n.includes(search.toLowerCase().trim())) }
                    : category

                const isVisible = (activeFilter === 'all' || activeFilter === category.id)
                    && filteredCategory.pokemon.length > 0

                return (
                    <CategorySection
                        key={category.id}
                        category={filteredCategory}
                        isVisible={isVisible}
                    />
                )
            })}

            {/* Empty state */}
            {search.trim() && CATEGORIES.every(c =>
                !c.pokemon.some(n => n.includes(search.toLowerCase().trim()))
            ) && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                        <p style={{ fontSize: '3rem', margin: '0 0 0.75rem' }}>😔</p>
                        <p style={{ fontSize: '1.1rem' }}>No rare Pokémon found matching "{search}"</p>
                    </div>
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

export default RarityPage