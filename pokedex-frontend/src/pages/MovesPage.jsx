import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const DEX = { red: '#cc2020', black: '#111111' }

const TYPE_CATEGORIES = [
    { id: 'normal', label: 'Normal', icon: '⭐', color: '#6b7280' },
    { id: 'fire', label: 'Fire', icon: '🔥', color: '#dc2626' },
    { id: 'water', label: 'Water', icon: '💧', color: '#2563eb' },
    { id: 'grass', label: 'Grass', icon: '🌿', color: '#16a34a' },
    { id: 'electric', label: 'Electric', icon: '⚡', color: '#ca8a04' },
    { id: 'ice', label: 'Ice', icon: '❄️', color: '#0891b2' },
    { id: 'fighting', label: 'Fighting', icon: '🥊', color: '#b91c1c' },
    { id: 'poison', label: 'Poison', icon: '☠️', color: '#7c3aed' },
    { id: 'ground', label: 'Ground', icon: '🌍', color: '#92400e' },
    { id: 'flying', label: 'Flying', icon: '🦅', color: '#0284c7' },
    { id: 'psychic', label: 'Psychic', icon: '🔮', color: '#db2777' },
    { id: 'bug', label: 'Bug', icon: '🐛', color: '#65a30d' },
    { id: 'rock', label: 'Rock', icon: '🪨', color: '#78716c' },
    { id: 'ghost', label: 'Ghost', icon: '👻', color: '#6d28d9' },
    { id: 'dragon', label: 'Dragon', icon: '🐉', color: '#4338ca' },
    { id: 'dark', label: 'Dark', icon: '🌑', color: '#db2777' },
    { id: 'steel', label: 'Steel', icon: '⚙️', color: '#475569' },
    { id: 'fairy', label: 'Fairy', icon: '🌸', color: '#be185d' },
]

const DAMAGE_COLORS = {
    physical: { bg: '#b91c1c', label: 'Physical' },
    special: { bg: '#1d4ed8', label: 'Special' },
    status: { bg: '#374151', label: 'Status' },
}

const PAGE_SIZE = 20

// ── Type category grid ────────────────────────────────────────────
function TypeGrid({ onSelect }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '0.85rem',
        }}>
            {TYPE_CATEGORIES.map(cat => (
                <div
                    key={cat.id}
                    onClick={() => onSelect(cat)}
                    style={{
                        backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '1.25rem',
                        border: '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s',
                        position: 'relative', overflow: 'hidden',
                        display: 'flex', flexDirection: 'column', gap: '0.5rem',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.4)` }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: cat.color }} />
                    <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                    <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>{cat.label}</h2>
                    <span style={{
                        backgroundColor: cat.color + '25', color: cat.color,
                        border: `1px solid ${cat.color}50`, borderRadius: '9999px',
                        fontSize: '0.72rem', fontWeight: '700', padding: '0.15rem 0.6rem', alignSelf: 'flex-start',
                    }}>Browse →</span>
                </div>
            ))}
        </div>
    )
}

// ── Move card ─────────────────────────────────────────────────────
function MoveCard({ move, color, onClick }) {
    const dmg = DAMAGE_COLORS[move.damageClass] || DAMAGE_COLORS.status
    return (
        <div onClick={onClick} style={{
            backgroundColor: '#1f2937', borderRadius: '1rem', padding: '1rem',
            border: '2px solid transparent', cursor: 'pointer', transition: 'all 0.18s',
            position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
        }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: color }} />

            {/* Name */}
            <span style={{ color: 'white', fontWeight: '700', fontSize: '0.9rem', textTransform: 'capitalize', lineHeight: 1.2 }}>
                {move.name.replace(/-/g, ' ')}
            </span>

            {/* Damage class badge */}
            <span style={{
                backgroundColor: dmg.bg, color: 'white',
                fontSize: '0.65rem', fontWeight: '700', padding: '0.15rem 0.5rem',
                borderRadius: '9999px', alignSelf: 'flex-start',
            }}>{dmg.label}</span>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <StatPill label="PWR" value={move.power ?? '—'} color={color} />
                <StatPill label="ACC" value={move.accuracy ? `${move.accuracy}%` : '—'} color={color} />
                <StatPill label="PP" value={move.pp ?? '—'} color={color} />
            </div>
        </div>
    )
}

function StatPill({ label, value, color }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            backgroundColor: '#374151', borderRadius: '0.5rem', padding: '0.2rem 0.5rem', minWidth: '40px',
        }}>
            <span style={{ color: '#9ca3af', fontSize: '0.6rem', fontWeight: '700' }}>{label}</span>
            <span style={{ color: 'white', fontWeight: '700', fontSize: '0.8rem' }}>{value}</span>
        </div>
    )
}

// ── Move list for a selected type ────────────────────────────────
function TypeMoveList({ category, onBack }) {
    const [moves, setMoves] = useState([])
    const [displayed, setDisplayed] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const cache = useRef({})
    const navigate = useNavigate()

    // Fetch all moves for this type
    useEffect(() => {
        let cancelled = false
        fetch(`https://pokeapi.co/api/v2/type/${category.id}`)
            .then(r => r.json())
            .then(data => {
                if (cancelled) return
                const moveList = data.moves.map(m => ({ name: m.name, url: m.url }))
                setMoves(moveList)
                setDisplayed([])
            })
        return () => { cancelled = true }
    }, [category.id])

    const fetchDetails = useCallback(async (list) => {
        return Promise.all(
            list.map(async m => {
                if (cache.current[m.name]) return cache.current[m.name]
                try {
                    const d = await fetch(m.url).then(r => r.json())
                    const result = {
                        name: d.name,
                        power: d.power,
                        accuracy: d.accuracy,
                        pp: d.pp,
                        damageClass: d.damage_class?.name,
                    }
                    cache.current[m.name] = result
                    return result
                } catch { return { name: m.name, power: null, accuracy: null, pp: null, damageClass: 'status' } }
            })
        )
    }, [])

    const filteredMoves = search.trim()
        ? moves.filter(m => m.name.includes(search.toLowerCase().trim()))
        : moves

    const totalPages = Math.max(1, Math.ceil(filteredMoves.length / PAGE_SIZE))
    const pageSlice = filteredMoves.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    useEffect(() => {
        let cancelled = false
        if (pageSlice.length === 0) {
            Promise.resolve().then(() => { if (!cancelled) { setDisplayed([]); setLoading(false) } })
            return () => { cancelled = true }
        }
        fetchDetails(pageSlice).then(details => {
            if (!cancelled) { setDisplayed(details); setLoading(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
        })
        return () => { cancelled = true }
    }, [moves, search, page])

    const handleSearch = (v) => { setSearch(v); setPage(1) }

    const getPaginationRange = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
        const range = [], delta = 2
        const left = Math.max(2, page - delta), right = Math.min(totalPages - 1, page + delta)
        range.push(1)
        if (left > 2) range.push('...')
        for (let i = left; i <= right; i++) range.push(i)
        if (right < totalPages - 1) range.push('...')
        range.push(totalPages)
        return range
    }

    const btnStyle = (active) => ({
        minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '0.5rem', border: `2px solid ${active ? DEX.black : 'rgba(255,255,255,0.15)'}`,
        backgroundColor: active ? category.color : 'rgba(0,0,0,0.45)',
        color: 'white', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer',
        boxShadow: active ? `2px 2px 0 ${DEX.black}` : 'none',
        transition: 'all 0.15s', userSelect: 'none',
    })

    return (
        <div>
            {/* Back button */}
            <button onClick={onBack} style={{
                backgroundColor: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem',
                padding: '0.45rem 1rem', cursor: 'pointer', fontWeight: '600',
                fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>← Back to Types</button>

            {/* Sub-header */}
            <div style={{
                backgroundColor: category.color,
                border: `3px solid ${DEX.black}`,
                borderRadius: '1.5rem',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
                position: 'relative', overflow: 'hidden',
                boxShadow: `4px 4px 0 ${DEX.black}`,
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
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>
                    Moves › {category.label} Type
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{category.icon}</span>
                    <h2 style={{ color: 'white', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 'bold', margin: 0 }}>
                        {category.label} Moves
                    </h2>
                    {moves.length > 0 && (
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            {filteredMoves.length.toLocaleString()} moves
                        </span>
                    )}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                    {Object.entries(DAMAGE_COLORS).map(([key, val]) => (
                        <span key={key} style={{
                            backgroundColor: val.bg + '40', color: 'white',
                            border: `1px solid ${val.bg}80`, borderRadius: '9999px',
                            fontSize: '0.7rem', fontWeight: '600', padding: '0.15rem 0.6rem',
                        }}>{val.label}</span>
                    ))}
                </div>

                {/* Search */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)',
                    border: '2px solid rgba(0,0,0,0.4)', borderRadius: '9999px',
                    padding: '0.35rem 0.35rem 0.35rem 1.1rem', maxWidth: '380px',
                }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>🔍</span>
                    <input
                        type="text"
                        placeholder={`Search ${category.label.toLowerCase()} moves...`}
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        style={{ flex: 1, backgroundColor: 'transparent', color: 'white', border: 'none', outline: 'none', fontSize: '0.9rem', padding: '0.35rem 0' }}
                    />
                    {search && (
                        <button onClick={() => handleSearch('')} style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontSize: '0.75rem', outline: 'none' }}>✕</button>
                    )}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div style={{ width: '3rem', height: '3rem', border: `4px solid ${category.color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            ) : displayed.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                    <p style={{ fontSize: '2.5rem', margin: '0 0 0.5rem' }}>😔</p>
                    <p>No moves found{search ? ` matching "${search}"` : ''}</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                        {displayed.map(move => (
                            <MoveCard
                                key={move.name}
                                move={move}
                                color={category.color}
                                onClick={() => navigate(`/moves/${move.name}`)}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', margin: 0 }}>
                                Page {page} of {totalPages} · {filteredMoves.length.toLocaleString()} moves
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                    style={{ ...btnStyle(false), opacity: page === 1 ? 0.35 : 1, padding: '0 0.75rem' }}
                                    onMouseEnter={e => { if (page !== 1) e.currentTarget.style.borderColor = category.color }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                                >← Prev</button>

                                {getPaginationRange().map((p, i) =>
                                    p === '...'
                                        ? <span key={`d${i}`} style={{ color: 'rgba(255,255,255,0.4)', padding: '0 0.25rem' }}>…</span>
                                        : <button key={p} onClick={() => setPage(p)} style={btnStyle(p === page)}
                                            onMouseEnter={e => { if (p !== page) e.currentTarget.style.borderColor = category.color }}
                                            onMouseLeave={e => { if (p !== page) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                                        >{p}</button>
                                )}

                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                    style={{ ...btnStyle(false), opacity: page === totalPages ? 0.35 : 1, padding: '0 0.75rem' }}
                                    onMouseEnter={e => { if (page !== totalPages) e.currentTarget.style.borderColor = category.color }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                                >Next →</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

// ── Main page ─────────────────────────────────────────────────────
export default function MovesPage() {
    const [selectedType, setSelectedType] = useState(null)

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1rem 5rem' }}>
            {!selectedType ? (
                <>
                    <PageHeader icon="💥" title="Moves" subtitle="Browse moves by type" />
                    <TypeGrid onSelect={setSelectedType} />
                </>
            ) : (
                <TypeMoveList
                    category={selectedType}
                    onBack={() => setSelectedType(null)}
                />
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}