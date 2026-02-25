import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const DEX = { red: '#cc2020', black: '#111111' }
const PAGE_SIZE = 40

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

// PokéAPI category slugs for each filter tab
const CATEGORY_API_SLUGS = {
    'held-items': ['held-items', 'choice', 'plates', 'type-enhancement', 'stat-boosts',
        'scarves', 'jewels', 'mega-stones', 'z-crystals', 'memories',
        'type-protection', 'effort-training', 'bad-held-items', 'other'],
    'medicine': ['medicine', 'healing', 'vitamins', 'revival', 'status-cures',
        'pp-recovery', 'flutes', 'drinks'],
    'pokeballs': ['standard-balls', 'special-balls', 'apricorn-balls', 'sport-balls'],
    'machines': ['all-machines', 'all-mail'],
    'berries': ['in-a-pinch', 'picky-healing', 'baking-only', 'effort-training',
        'type-protection', 'other'],
    'key-items': ['key-items', 'event-items', 'gameplay', 'plot-advancement',
        'collectibles', 'loot', 'species-specific', 'training'],
    'battle-items': ['battle-items'],
}

function getCategoryColor(id) {
    return CATEGORIES.find(c => c.id === id)?.color || '#6b7280'
}

function getCategoryIcon(id) {
    return CATEGORIES.find(c => c.id === id)?.icon || '🎒'
}

function getCategoryFilterForItem(categoryName) {
    if (!categoryName) return 'all'
    const n = categoryName.toLowerCase()
    if (n.includes('ball') || n.includes('apricorn') || n.includes('sport-ball')) return 'pokeballs'
    if (n.includes('machine') || n.includes('mail')) return 'machines'
    if (n.includes('medicine') || n.includes('healing') || n.includes('vitamin') ||
        n.includes('revival') || n.includes('status-cure') || n.includes('drink') ||
        n.includes('flute') || n.includes('pp-')) return 'medicine'
    if (n === 'key-items' || n.includes('event') || n.includes('plot') ||
        n.includes('gameplay') || n.includes('collectible') || n.includes('loot') ||
        n.includes('species-specific') || n.includes('training')) return 'key-items'
    if (n === 'battle-items') return 'battle-items'
    if (n.includes('held') || n.includes('choice') || n.includes('plate') ||
        n.includes('stone') || n.includes('crystal') || n.includes('memory') ||
        n.includes('scarf') || n.includes('jewel') || n.includes('enhancement') ||
        n.includes('boost') || n.includes('stat-boost') || n.includes('bad-held')) return 'held-items'
    // berries are detected by other checks, but type-protection / effort-training can overlap
    if (n.includes('pinch') || n.includes('baking') || n.includes('picky')) return 'berries'
    return 'all'
}

function ItemCard({ item, onClick, filterId }) {
    const sprite = item.sprites?.default
    const color = getCategoryColor(filterId !== 'all' ? filterId : getCategoryFilterForItem(item.category?.name))
    const icon = getCategoryIcon(filterId !== 'all' ? filterId : getCategoryFilterForItem(item.category?.name))

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
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: color, opacity: 0.6 }} />
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

export default function ItemsPage() {
    const [allItems, setAllItems] = useState([])   // full list (names+urls) for "All"
    const [categoryItems, setCategoryItems] = useState({})   // { filterId: [{name,url}] }
    const [loadingCategory, setLoadingCategory] = useState({}) // { filterId: bool }
    const [displayed, setDisplayed] = useState([])
    const [loadingItems, setLoadingItems] = useState(false)
    const [loadingAll, setLoadingAll] = useState(true)
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const [page, setPage] = useState(1)
    const cache = useRef({})
    const navigate = useNavigate()

    // Load full name list once (for "All" tab)
    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/item?limit=2200&offset=0')
            .then(r => r.json())
            .then(data => { setAllItems(data.results); setLoadingAll(false) })
    }, [])

    // When a non-"all" filter is selected, fetch that category's items from API
    useEffect(() => {
        if (activeFilter === 'all') return
        if (categoryItems[activeFilter] || loadingCategory[activeFilter]) return

        setLoadingCategory(prev => ({ ...prev, [activeFilter]: true }))
        const slugs = CATEGORY_API_SLUGS[activeFilter] || []

        Promise.allSettled(
            slugs.map(slug =>
                fetch(`https://pokeapi.co/api/v2/item-category/${slug}`)
                    .then(r => r.ok ? r.json() : null)
                    .then(d => d?.items || [])
                    .catch(() => [])
            )
        ).then(results => {
            const items = results.flatMap(r => r.status === 'fulfilled' ? r.value : [])
            // Deduplicate
            const seen = new Set()
            const unique = items.filter(i => seen.has(i.name) ? false : seen.add(i.name))
            setCategoryItems(prev => ({ ...prev, [activeFilter]: unique }))
            setLoadingCategory(prev => ({ ...prev, [activeFilter]: false }))
        })
    }, [activeFilter])

    // Current source list (all or category-specific), then apply search
    const sourceList = activeFilter === 'all'
        ? allItems
        : (categoryItems[activeFilter] || [])

    const filteredList = search.trim()
        ? sourceList.filter(i => i.name.includes(search.toLowerCase().trim()))
        : sourceList

    const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE))

    // Fetch details for current page slice
    const fetchSlice = useCallback(async (items) => {
        const results = await Promise.all(
            items.map(async item => {
                if (cache.current[item.name]) return cache.current[item.name]
                try {
                    const r = await fetch(item.url)
                    const d = await r.json()
                    const result = { id: d.id, name: d.name, category: d.category, sprites: d.sprites, cost: d.cost }
                    cache.current[item.name] = result
                    return result
                } catch { return null }
            })
        )
        return results.filter(Boolean)
    }, [])

    useEffect(() => {
        const isSourceReady = activeFilter === 'all' ? allItems.length > 0 : categoryItems[activeFilter]
        if (!isSourceReady) return
        let cancelled = false
        const start = (page - 1) * PAGE_SIZE
        fetchSlice(filteredList.slice(start, start + PAGE_SIZE)).then(details => {
            if (!cancelled) {
                setDisplayed(details)
                setLoadingItems(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        })
        return () => { cancelled = true }
    }, [page, search, activeFilter, allItems, categoryItems, fetchSlice])

    const handleSearch = (v) => { setSearch(v); setPage(1) }
    const handleFilter = (id) => { setActiveFilter(id); setPage(1) }

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
        backgroundColor: active ? DEX.red : 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
        color: active ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: '0.85rem',
        cursor: 'pointer', boxShadow: active ? `2px 2px 0 ${DEX.black}` : 'none',
        transition: 'all 0.15s', userSelect: 'none',
    })

    const isLoading = loadingAll || (activeFilter !== 'all' && loadingCategory[activeFilter])

    if (loadingAll && allItems.length === 0) return (
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
                onSearch={handleSearch}
                searchPlaceholder="Search items..."
            >
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {CATEGORIES.map(cat => (
                        <button key={cat.id} onClick={() => handleFilter(cat.id)} style={{
                            padding: '0.35rem 0.85rem', borderRadius: '9999px', cursor: 'pointer',
                            border: `2px solid ${activeFilter === cat.id ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.2)'}`,
                            backgroundColor: activeFilter === cat.id ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.1)',
                            color: 'white', fontWeight: activeFilter === cat.id ? '700' : '500',
                            fontSize: '0.78rem', transition: 'all 0.15s', backdropFilter: 'blur(4px)',
                        }}>
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>
            </PageHeader>

            {/* Category loading spinner */}
            {isLoading && activeFilter !== 'all' && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div style={{ width: '3rem', height: '3rem', border: `4px solid ${getCategoryColor(activeFilter)}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            )}

            {/* Grid */}
            {!isLoading && (
                loadingItems ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <div style={{ width: '3rem', height: '3rem', border: `4px solid ${DEX.red}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    </div>
                ) : displayed.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                        <p style={{ fontSize: '2.5rem', margin: '0 0 0.5rem' }}>😔</p>
                        <p>No items found{search ? ` matching "${search}"` : ''}</p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
                            {displayed.map(item => (
                                <ItemCard key={item.id} item={item} filterId={activeFilter} onClick={() => navigate(`/items/${item.name}`)} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', margin: 0 }}>
                                    Page {page} of {totalPages} · {filteredList.length.toLocaleString()} items
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                        style={{ ...btnStyle(false), opacity: page === 1 ? 0.35 : 1, padding: '0 0.75rem' }}
                                        onMouseEnter={e => { if (page !== 1) e.currentTarget.style.borderColor = DEX.red }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                                    >← Prev</button>

                                    {getPaginationRange().map((item, i) =>
                                        item === '...'
                                            ? <span key={`d${i}`} style={{ color: 'rgba(255,255,255,0.4)', padding: '0 0.25rem' }}>…</span>
                                            : <button key={item} onClick={() => setPage(item)} style={btnStyle(item === page)}
                                                onMouseEnter={e => { if (item !== page) e.currentTarget.style.borderColor = DEX.red }}
                                                onMouseLeave={e => { if (item !== page) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                                            >{item}</button>
                                    )}

                                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                        style={{ ...btnStyle(false), opacity: page === totalPages ? 0.35 : 1, padding: '0 0.75rem' }}
                                        onMouseEnter={e => { if (page !== totalPages) e.currentTarget.style.borderColor = DEX.red }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                                    >Next →</button>
                                </div>
                            </div>
                        )}
                    </>
                )
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}