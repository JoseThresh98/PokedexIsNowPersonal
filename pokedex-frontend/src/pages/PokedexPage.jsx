import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPokemonDetail } from '../services/pokemonService'
import PokemonCard from '../components/PokemonCard'
import PageHeader from '../components/PageHeader'

const DEX = { red: '#cc2020', black: '#111111' }
const PAGE_SIZE = 20

function PokedexPage() {
    const [allNames, setAllNames] = useState([])   // all ~1302 names from API
    const [displayed, setDisplayed] = useState([])   // fetched detail objects shown
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(0)
    const detailCache = useRef({})       // cache fetched details by name
    const navigate = useNavigate()

    // 1. Load all names on mount (one lightweight request)
    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
            .then(r => r.json())
            .then(data => {
                setAllNames(data.results.map(p => p.name))
            })
    }, [])

    // 2. Filtered names list (reacts to search)
    const filteredNames = search.trim()
        ? allNames.filter(n => n.includes(search.toLowerCase().trim()))
        : allNames

    // 3. Fetch details for a slice of names
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

    // 4. When search or allNames changes → reset and load first page
    useEffect(() => {
        if (allNames.length === 0) return
        setLoading(true)
        setPage(0)
        setDisplayed([])
        const firstSlice = filteredNames.slice(0, PAGE_SIZE)
        fetchSlice(firstSlice).then(details => {
            setDisplayed(details)
            setLoading(false)
        })
    }, [search, allNames])

    // 5. Load more
    const loadMore = async () => {
        setLoadingMore(true)
        const nextPage = page + 1
        const start = nextPage * PAGE_SIZE
        const slice = filteredNames.slice(start, start + PAGE_SIZE)
        const details = await fetchSlice(slice)
        setDisplayed(prev => [...prev, ...details])
        setPage(nextPage)
        setLoadingMore(false)
    }

    const hasMore = (page + 1) * PAGE_SIZE < filteredNames.length

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>

            <PageHeader
                title="Pokédex"
                icon="📖"
                subtitle={allNames.length > 0 ? `${filteredNames.length.toLocaleString()} Pokémon` : 'Loading...'}
                search={search}
                onSearch={setSearch}
                placeholder="Search by name..."
            />

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div style={{ width: '3rem', height: '3rem', border: `4px solid ${DEX.red}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            ) : (
                <>
                    {displayed.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                            <p style={{ fontSize: '2rem' }}>😔</p>
                            <p>No Pokémon found matching "{search}"</p>
                        </div>
                    ) : (
                        <>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                gap: '1rem',
                            }}>
                                {displayed.map(pokemon => (
                                    <PokemonCard
                                        key={pokemon.id}
                                        pokemon={pokemon}
                                        onClick={() => navigate(`/pokemon/${pokemon.name}`)}
                                    />
                                ))}
                            </div>

                            {hasMore && !search.trim() && (
                                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                                    <button
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        style={{
                                            backgroundColor: DEX.red, color: 'white',
                                            border: `3px solid ${DEX.black}`, borderRadius: '9999px',
                                            padding: '0.75rem 2.5rem', fontWeight: 'bold', fontSize: '1rem',
                                            cursor: loadingMore ? 'not-allowed' : 'pointer',
                                            boxShadow: `3px 3px 0 ${DEX.black}`, outline: 'none',
                                            opacity: loadingMore ? 0.7 : 1,
                                        }}
                                    >
                                        {loadingMore ? 'Loading...' : `Load more — ${filteredNames.length - displayed.length} remaining`}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default PokedexPage