import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const DEX = { red: '#cc2020', black: '#111111' }
const PAGE_SIZE = 40

// Item categories with icons and colors
const CATEGORIES = [
    { id: 'all', label: 'All', icon: '🎒', color: DEX.red },
    { id: 'held-items', label: 'Held Items', icon: '💎', color: '#6366f1' },
    { id: 'medicine', label: 'Medicine', icon: '💊', color: '#ec4899' },
    { id: 'pokeballs', label: 'Poké Balls', icon: '⚪', color: '#f59e0b' },
    { id: 'machines', label: 'TM / HM', icon: '💿', color: '#06b6d4' },
    { id: 'berries', label: 'Berries', icon: '🍓', color: '#22c55e' },
    { id: 'key-items', label: 'Key Items', icon: '🔑', color: '#f97316' },
    { id: 'battle-items', label: 'Battle', icon: '⚔️', color: '#ef4444' },
]

// PokéAPI category slugs that map to each filter tab
const CATEGORY_SLUGS = {
    'held-items': ['held-items', 'choice', 'plates', 'type-enhancement', 'stat-boosts', 'scarves', 'jewels', 'mega-stones', 'z-crystals', 'memories'],
    'medicine': ['healing', 'status-cures', 'vitamins', 'revival', 'pp-recovery', 'flutes', 'drinks', 'other-medicines'],
    'pokeballs': ['standard-balls', 'special-balls', 'apricorn-balls'],
    'machines': ['all-machines', 'all-mail'],
    'berries': ['effort-training', 'type-protection', 'baking-only', 'in-a-pinch', 'picky-healing', 'other', 'medicine'],
    'key-items': ['event-items', 'gameplay', 'plot-advancement', 'collectibles', 'loot', 'species-specific', 'training', 'bad-held-items'],
    'battle-items': ['battle-items'],
}

// Map PokéAPI category name → our filter tab
function getCategoryFilter(categoryName) {
    if (!categoryName) return 'all'
    const name = categoryName.toLowerCase()
    if (name.includes('ball')) return 'pokeballs'
    if (name.includes('machine') || name.includes('tm') || name.includes('hm') || name.includes('tr')) return 'machines'
    if (name.includes('berry') || name.includes('pinch') || name.includes('baking')) return 'berries'
    if (name.includes('key') || name.includes('event') || name.includes('plot') || name.includes('gameplay') || name.includes('loot') || name.includes('collectible')) return 'key-items'
    if (name.includes('medicine') || name.includes('heal') || name.includes('vitamin') || name.includes('revival') || name.includes('cure') || name.includes('drink') || name.includes('flute') || name.includes('pp-')) return 'medicine'
    if (name.includes('battle')) return 'battle-items'
    if (name.includes('held') || name.includes('choice') || name.includes('plate') || name.includes('stone') || name.includes('crystal') || name.includes('memory') || name.includes('scarf') || name.includes('jewel') || name.includes('enhancement') || name.includes('boost') || name.includes('type-protection') || name.includes('effort')) return 'held-items'
    return 'all'
}

function ItemCard({ item, onClick }) {
    const sprite = item.sprites?.default
    const categoryName = item.category?.name || ''
    const filter = getCategoryFilter(categoryName)
    const cat = CATEGORIES.find(c => c.id === filter) || CATEGORIES[0]

    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: '#1f2937',
                borderRadius: '1rem',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                border: '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.18s',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = cat.color
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.4)`
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            {/* Category color accent */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '3px', backgroundColor: cat.color, opacity: 0.6,
            }} />

            {/* Sprite */}
            <div style={{
                width: '64px', height: '64px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#374151', borderRadius: '50%',
                border: `2px solid ${cat.color}30`,
            }}>
                {sprite
                    ? <img src={sprite} alt={item.name} style={{ width: '48px', height: '48px', imageRendering: 'pixelated', objectFit: 'contain' }} />
                    : <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                }
            </div>

            {/* Name */}
            <span style={{
                color: 'white', fontWeight: '600', fontSize: '0.8rem',
                textAlign: 'center', textTransform: 'capitalize',
                lineHeight: 1.3,
            }}>
                {item.name.replace(/-/g, ' ')}
            </span>

            {/* Category badge */}
            <span style={{
                backgroundColor: cat.color + '25',
                color: cat.color,
                border: `1px solid ${cat.color}50`,
                borderRadius: '9999px',
                fontSize: '0.65rem', fontWeight: '700',
                padding: '0.15rem 0.5rem',
                textTransform: 'capitalize',
            }}>
                {cat.label}
            </span>
        </div>
    )
}

export default function ItemsPage() {
    const [allItems, setAllItems] = useState([])   // full name list
    const [displayed, setDisplayed] = useState([])   // current page with details
    const [loading, setLoading] = useState(true)
    const [loadingItems, setLoadingItems] = useState(false)
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const [page, setPage] = useState(1)
    const cache = useRef({})
    const navigate = useNavigate()

    // Load full name list once
    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/item?limit=2200&offset=0')
            .then(r => r.json())
            .then(data => {
                setAllItems(data.results)
                setLoading(false)
            })
    }, [])

    // Compute filtered list
    const filteredItems = allItems.filter(item => {
        if (search.trim()) return item.name.includes(search.toLowerCase().trim())
        return true
    })

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))

    // Fetch detail for a slice of items
    const fetchSlice = useCallback(async (items) => {
        const results = await Promise.all(
            items.map(async item => {
                if (cache.current[item.name]) return cache.current[item.name]
                try {
                    const r = await fetch(item.url)
                    const d = await r.json()
                    const result = {
                        id: d.id,
                        name: d.name,
                        category: d.category,
                        sprites: d.sprites,
                        cost: d.cost,
                        effect: d.effect_entries?.find(e => e.language.name === 'en')?.short_effect || '',
                    }
                    cache.current[item.name] = result
                    return result
                } catch { return null }
            })
        )
        return results.filter(Boolean)
    }, [])

    useEffect(() => {
        if (allItems.length === 0) return
        let cancelled = false
        const start = (page - 1) * PAGE_SIZE
        fetchSlice(filteredItems.slice(start, start + PAGE_SIZE)).then(details => {
            if (!cancelled) {
                setDisplayed(details)
                setLoadingItems(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        })
        return () => { cancelled = true }
    }, [page, search, allItems, fetchSlice])

    // Filter displayed items by category client-side
    const visibleItems = activeFilter === 'all'
        ? displayed
        : displayed.filter(item => getCategoryFilter(item.category?.name) === activeFilter)

    // Pagination range
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
        minWidth: '36px', height: '36px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '0.5rem',
        border: `2px solid ${active ? DEX.black : 'rgba(255,255,255,0.15)'}`,
        backgroundColor: active ? DEX.red : 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(8px)',
        color: active ? 'white' : 'rgba(255,255,255,0.7)',
        fontWeight: 'bold', fontSize: '0.85rem',
        cursor: 'pointer',
        boxShadow: active ? `2px 2px 0 ${DEX.black}` : 'none',
        transition: 'all 0.15s',
        userSelect: 'none',
    })

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ width: '3rem', height: '3rem', border: `4px solid ${DEX.red}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1rem 5rem' }}>

            <PageHeader
                icon="🎒"
                title="Items"
                subtitle={`${allItems.length.toLocaleString()} items — click one to see details`}
                searchValue={search}
                onSearch={setSearch}
                searchPlaceholder="Search items..."
            >
                {/* Category filter tabs */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.id)}
                            style={{
                                padding: '0.35rem 0.85rem',
                                borderRadius: '9999px',
                                border: `2px solid ${activeFilter === cat.id ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.2)'}`,
                                backgroundColor: activeFilter === cat.id ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.1)',
                                color: 'white',
                                fontWeight: activeFilter === cat.id ? '700' : '500',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                backdropFilter: 'blur(4px)',
                            }}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>
            </PageHeader>

            {/* Grid */}
            {loadingItems ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div style={{ width: '3rem', height: '3rem', border: `4px solid ${DEX.red}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            ) : visibleItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                    <p style={{ fontSize: '2.5rem', margin: '0 0 0.5rem' }}>😔</p>
                    <p>No items found{search ? ` matching "${search}"` : ''}</p>
                </div>
            ) : (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                        gap: '0.75rem',
                        marginBottom: '2.5rem',
                    }}>
                        {visibleItems.map(item => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                onClick={() => navigate(`/items/${item.name}`)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && activeFilter === 'all' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', margin: 0 }}>
                                Page {page} of {totalPages} · {filteredItems.length.toLocaleString()} items
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    style={{ ...btnStyle(false), opacity: page === 1 ? 0.35 : 1, padding: '0 0.75rem' }}
                                    onMouseEnter={e => { if (page !== 1) e.currentTarget.style.borderColor = DEX.red }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                                >← Prev</button>

                                {getPaginationRange().map((item, i) =>
                                    item === '...'
                                        ? <span key={`d${i}`} style={{ color: 'rgba(255,255,255,0.4)', padding: '0 0.25rem' }}>…</span>
                                        : <button
                                            key={item}
                                            onClick={() => setPage(item)}
                                            style={btnStyle(item === page)}
                                            onMouseEnter={e => { if (item !== page) e.currentTarget.style.borderColor = DEX.red }}
                                            onMouseLeave={e => { if (item !== page) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                                        >{item}</button>
                                )}

                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    style={{ ...btnStyle(false), opacity: page === totalPages ? 0.35 : 1, padding: '0 0.75rem' }}
                                    onMouseEnter={e => { if (page !== totalPages) e.currentTarget.style.borderColor = DEX.red }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                                >Next →</button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}