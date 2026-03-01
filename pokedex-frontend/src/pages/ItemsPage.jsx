import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const DEX = { red: '#cc2020', black: '#111111' }

const CATEGORIES = [
    {
        id: 'held-items',
        label: 'Held Items',
        icon: '💎',
        color: '#6366f1',
        description: 'Items Pokémon can hold to boost their abilities in battle',
        slugs: ['held-items', 'choice', 'plates', 'type-enhancement', 'stat-boosts',
            'scarves', 'jewels', 'mega-stones', 'z-crystals', 'memories',
            'type-protection', 'effort-training', 'bad-held-items'],
    },
    {
        id: 'medicine',
        label: 'Medicine',
        icon: '💊',
        color: '#ec4899',
        description: 'Healing items, vitamins, and status cures',
        slugs: ['medicine', 'healing', 'vitamins', 'revival', 'status-cures',
            'pp-recovery', 'flutes', 'drinks'],
    },
    {
        id: 'pokeballs',
        label: 'Poké Balls',
        icon: '⚪',
        color: '#f59e0b',
        description: 'Capsules used to catch and store Pokémon',
        slugs: ['standard-balls', 'special-balls', 'apricorn-balls', 'sport-balls'],
    },
    {
        id: 'machines',
        label: 'TM / HM',
        icon: '💿',
        color: '#06b6d4',
        description: 'Technical and Hidden Machines that teach moves',
        slugs: ['all-machines'],
    },
    {
        id: 'berries',
        label: 'Berries',
        icon: '🍓',
        color: '#22c55e',
        description: 'Natural berries with a variety of in-battle effects',
        slugs: ['in-a-pinch', 'picky-healing', 'baking-only', 'type-protection', 'other'],
    },
    {
        id: 'key-items',
        label: 'Key Items',
        icon: '🔑',
        color: '#f97316',
        description: 'Important items needed to progress through the game',
        slugs: ['key-items', 'event-items', 'gameplay', 'plot-advancement',
            'collectibles', 'loot', 'species-specific', 'training'],
    },
    {
        id: 'battle-items',
        label: 'Battle Items',
        icon: '⚔️',
        color: '#ef4444',
        description: 'Items used during battle to gain an advantage',
        slugs: ['battle-items'],
    },
]

// ── Category card grid ────────────────────────────────────────────
function CategoryGrid({ onSelect }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
        }}>
            {CATEGORIES.map(cat => (
                <div
                    key={cat.id}
                    onClick={() => onSelect(cat)}
                    style={{
                        backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '1.5rem',
                        border: '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s',
                        position: 'relative', overflow: 'hidden',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: cat.color }} />
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
                    <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 0.4rem' }}>{cat.label}</h2>
                    <p style={{ color: '#9ca3af', fontSize: '0.82rem', margin: '0 0 1rem', lineHeight: 1.5 }}>{cat.description}</p>
                    <span style={{
                        backgroundColor: cat.color + '25', color: cat.color,
                        border: `1px solid ${cat.color}50`, borderRadius: '9999px',
                        fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.7rem',
                    }}>Browse →</span>
                </div>
            ))}
        </div>
    )
}

// ── Item card ─────────────────────────────────────────────────────
function ItemCard({ item, color, icon, onClick }) {
    const sprite = item.sprites?.default
    return (
        <div onClick={onClick} style={{
            backgroundColor: '#1f2937', borderRadius: '1rem', padding: '1rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            border: '2px solid transparent', cursor: 'pointer', transition: 'all 0.18s',
            position: 'relative', overflow: 'hidden',
        }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: color, opacity: 0.7 }} />
            <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#374151', borderRadius: '50%', border: `2px solid ${color}30` }}>
                {sprite
                    ? <img src={sprite} alt={item.name} style={{ width: '48px', height: '48px', imageRendering: 'pixelated', objectFit: 'contain' }} />
                    : <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                }
            </div>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '0.8rem', textAlign: 'center', textTransform: 'capitalize', lineHeight: 1.3 }}>
                {item.name.replace(/-/g, ' ')}
            </span>
        </div>
    )
}

const PAGE_SIZE = 20

// ── Items list for a selected category ───────────────────────────
function CategoryItemList({ category, onBack }) {
    const [items, setItems] = useState([])   // full name list for category
    const [displayed, setDisplayed] = useState([])   // fetched detail for current page
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const cache = useRef({})
    const navigate = useNavigate()

    // 1. Fetch all item names for this category
    useEffect(() => {
        let cancelled = false
        Promise.allSettled(
            category.slugs.map(slug =>
                fetch(`https://pokeapi.co/api/v2/item-category/${slug}`)
                    .then(r => r.ok ? r.json() : null)
                    .then(d => d?.items || [])
                    .catch(() => [])
            )
        ).then(results => {
            if (cancelled) return
            const all = results.flatMap(r => r.status === 'fulfilled' ? r.value : [])
            const seen = new Set()
            const unique = all.filter(i => seen.has(i.name) ? false : seen.add(i.name))
            setItems(unique)
            setDisplayed([])
        })
        return () => { cancelled = true }
    }, [category.id])

    // 2. Fetch sprite details for current page slice only
    const fetchDetails = useCallback(async (list) => {
        return Promise.all(
            list.map(async item => {
                if (cache.current[item.name]) return cache.current[item.name]
                try {
                    const d = await fetch(item.url).then(r => r.json())
                    const result = { id: d.id, name: d.name, sprites: d.sprites }
                    cache.current[item.name] = result
                    return result
                } catch { return { id: null, name: item.name, sprites: {} } }
            })
        )
    }, [])

    const filteredItems = search.trim()
        ? items.filter(i => i.name.includes(search.toLowerCase().trim()))
        : items

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
    const pageSlice = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    useEffect(() => {
        let cancelled = false
        if (pageSlice.length === 0) {
            Promise.resolve().then(() => {
                if (!cancelled) { setDisplayed([]); setLoading(false) }
            })
            return () => { cancelled = true }
        }
        fetchDetails(pageSlice).then(details => {
            if (!cancelled) { setDisplayed(details); setLoading(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
        })
        return () => { cancelled = true }
    }, [items, search, page])

    const handleSearch = (v) => { setSearch(v); setPage(1) }

    // Pagination helpers
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
            {/* Category sub-header */}
            <div style={{
                backgroundColor: category.color,
                border: `3px solid ${DEX.black}`,
                borderRadius: '1.5rem',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.25rem',
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
                    Items › {category.label}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{category.icon}</span>
                    <h2 style={{ color: 'white', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 'bold', margin: 0 }}>
                        {category.label}
                    </h2>
                    {items.length > 0 && (
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            {filteredItems.length.toLocaleString()} items
                        </span>
                    )}
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
                        placeholder={`Search ${category.label.toLowerCase()}...`}
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        style={{ flex: 1, backgroundColor: 'transparent', color: 'white', border: 'none', outline: 'none', fontSize: '0.9rem', padding: '0.35rem 0' }}
                    />
                    {search && (
                        <button onClick={() => handleSearch('')} style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontSize: '0.75rem', outline: 'none' }}>✕</button>
                    )}
                </div>
            </div>

            {/* Back */}
            <button onClick={onBack} style={{
                backgroundColor: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem',
                padding: '0.45rem 1rem', cursor: 'pointer', fontWeight: '600',
                fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
                ← Back to Categories
            </button>

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div style={{ width: '3rem', height: '3rem', border: `4px solid ${category.color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            ) : displayed.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                    <p style={{ fontSize: '2.5rem', margin: '0 0 0.5rem' }}>😔</p>
                    <p>No items found{search ? ` matching "${search}"` : ''}</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                        {displayed.map(item => (
                            <ItemCard
                                key={item.name}
                                item={item}
                                color={category.color}
                                icon={category.icon}
                                onClick={() => navigate(`/items/${item.name}`)}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', margin: 0 }}>
                                Page {page} of {totalPages} · {filteredItems.length.toLocaleString()} items
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                    style={{ ...btnStyle(false), opacity: page === 1 ? 0.35 : 1, padding: '0 0.75rem' }}
                                    onMouseEnter={e => { if (page !== 1) e.currentTarget.style.borderColor = category.color }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                                >← Prev</button>

                                {getPaginationRange().map((item, i) =>
                                    item === '...'
                                        ? <span key={`d${i}`} style={{ color: 'rgba(255,255,255,0.4)', padding: '0 0.25rem' }}>…</span>
                                        : <button key={item} onClick={() => setPage(item)} style={btnStyle(item === page)}
                                            onMouseEnter={e => { if (item !== page) e.currentTarget.style.borderColor = category.color }}
                                            onMouseLeave={e => { if (item !== page) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                                        >{item}</button>
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
export default function ItemsPage() {
    const [selectedCategory, setSelectedCategory] = useState(null)

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1rem 5rem' }}>
            {!selectedCategory ? (
                <>
                    <PageHeader icon="🎒" title="Items" subtitle="Browse items by category" />
                    <CategoryGrid onSelect={setSelectedCategory} />
                </>
            ) : (
                <CategoryItemList
                    category={selectedCategory}
                    onBack={() => setSelectedCategory(null)}
                />
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}