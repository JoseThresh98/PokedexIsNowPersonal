import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPokemonDetail } from '../services/pokemonService'
import PokemonCard from '../components/PokemonCard'
import PageHeader from '../components/PageHeader'

const DEX = { red: '#cc2020', black: '#111111' }
const PAGE_SIZE = 20

function PokedexPage() {
    const [allNames, setAllNames] = useState([])
    const [displayed, setDisplayed] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const detailCache = useRef({})
    const navigate = useNavigate()

    // Load all names once on mount
    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
            .then(r => r.json())
            .then(data => setAllNames(data.results.map(p => p.name)))
    }, [])

    const fetchSlice = useCallback(async (names) => {
        const results = await Promise.all(
            names.map(async name => {
                if (detailCache.current[name]) return detailCache.current[name]
                try {
                    const d = await getPokemonDetail(name)
                    detailCache.current[name] = d
                    return d
                } catch { return null }
            })
        )
        return results.filter(Boolean)
    }, [])

    // Fetch on page OR search change
    useEffect(() => {
        if (allNames.length === 0) return
        let cancelled = false

        const names = search.trim()
            ? allNames.filter(n => n.includes(search.toLowerCase().trim()))
            : allNames

        setLoading(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })

        const start = (page - 1) * PAGE_SIZE
        fetchSlice(names.slice(start, start + PAGE_SIZE)).then(details => {
            if (!cancelled) {
                setDisplayed(details)
                setLoading(false)
            }
        })

        return () => { cancelled = true }
    }, [page, search, allNames, fetchSlice]) // search IS a dep — page reset handled below

    // When search changes, reset to page 1
    useEffect(() => {
        setPage(1)
    }, [search])

    const handleSearch = (value) => {
        setSearch(value)
    }

    const filteredNames = search.trim()
        ? allNames.filter(n => n.includes(search.toLowerCase().trim()))
        : allNames

    const totalPages = Math.max(1, Math.ceil(filteredNames.length / PAGE_SIZE))

    const getPaginationRange = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
        const range = []
        const delta = 2
        const left = Math.max(2, page - delta)
        const right = Math.min(totalPages - 1, page + delta)
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

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1rem 4rem' }}>

            <PageHeader
                icon="📖"
                title="Pokédex"
                subtitle={allNames.length > 0 ? `${filteredNames.length.toLocaleString()} Pokémon` : undefined}
                searchValue={search}
                onSearch={handleSearch}
                searchPlaceholder="Search by name..."
            />

            {/* ── Grid ── */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div style={{ width: '3rem', height: '3rem', border: `4px solid ${DEX.red}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            ) : displayed.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <p style={{ fontSize: '2rem' }}>😔</p>
                    <p>No Pokémon found matching "{search}"</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '1rem' }}>
                        {displayed.map(pokemon => (
                            <PokemonCard
                                key={pokemon.id}
                                pokemon={pokemon}
                                onClick={() => navigate(`/pokemon/${pokemon.name}`)}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', margin: 0 }}>
                                Page {page} of {totalPages} · {filteredNames.length.toLocaleString()} Pokémon
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
                                    item === '...' ? (
                                        <span key={`dots-${i}`} style={{ color: 'rgba(255,255,255,0.4)', padding: '0 0.25rem' }}>…</span>
                                    ) : (
                                        <button
                                            key={item}
                                            onClick={() => setPage(item)}
                                            style={btnStyle(item === page)}
                                            onMouseEnter={e => { if (item !== page) e.currentTarget.style.borderColor = DEX.red }}
                                            onMouseLeave={e => { if (item !== page) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                                        >{item}</button>
                                    )
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

export default PokedexPage