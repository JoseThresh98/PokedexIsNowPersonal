import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAbilityList } from '../services/pokemonService'
import PageHeader from '../components/PageHeader'

const PAGE_SIZE = 24

const abilityIcons = ['⚡', '🔥', '💧', '🌿', '❄️', '🌪️', '✨', '🛡️', '👁️', '💥']

const getIcon = (name) => {
    const index = name.charCodeAt(0) % abilityIcons.length
    return abilityIcons[index]
}

function AbilitiesPage() {
    const [allAbilities, setAllAbilities] = useState([])
    const [displayed, setDisplayed] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingDetails, setLoadingDetails] = useState(false)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)

    // Load all ability names once
    useEffect(() => {
        getAbilityList(400)
            .then(data => { setAllAbilities(data.results) })
            .finally(() => setLoading(false))
    }, [])

    // Fetch details for current page slice
    useEffect(() => {
        if (allAbilities.length === 0) return
        let cancelled = false

        const filtered = allAbilities.filter(a =>
            a.name.includes(search.toLowerCase().trim())
        )
        const start = (page - 1) * PAGE_SIZE
        const slice = filtered.slice(start, start + PAGE_SIZE)

        Promise.all(
            slice.map(a =>
                fetch(a.url).then(r => r.json()).then(detail => ({
                    name: detail.name,
                    count: detail.pokemon.length,
                    description: detail.effect_entries.find(e => e.language.name === 'en')?.short_effect ?? ''
                }))
            )
        ).then(results => {
            if (!cancelled) { setDisplayed(results); setLoadingDetails(false) }
        })

        return () => { cancelled = true }
    }, [allAbilities, page, search])

    const filtered = allAbilities.filter(a =>
        a.name.includes(search.toLowerCase().trim())
    )
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>

            <PageHeader
                title="Abilities"
                icon="⚡"
                subtitle={`${allAbilities.length} total abilities — click one to see details & Pokémon`}
                searchValue={search}
                onSearch={(val) => { setSearch(val); setPage(1) }}
                searchPlaceholder="Search abilities..."
            />

            {/* Initial load spinner */}
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div style={{ width: '3rem', height: '3rem', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            )}

            {/* Details loading spinner */}
            {!loading && loadingDetails && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div style={{ width: '3rem', height: '3rem', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            )}

            {/* Grid */}
            {!loading && !loadingDetails && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {displayed.map(ability => (
                        <Link key={ability.name} to={`/abilities/${ability.name}`} style={{ textDecoration: 'none' }}>
                            <div
                                style={{
                                    backgroundColor: '#1f2937', borderRadius: '1rem', padding: '1.25rem',
                                    border: '2px solid transparent', transition: 'all 0.2s', cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#dc2626'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <h3 style={{ color: 'white', fontWeight: 'bold', textTransform: 'capitalize', fontSize: '1rem' }}>
                                    {getIcon(ability.name)} {ability.name.replace(/-/g, ' ')}
                                </h3>
                                <p style={{ color: '#9ca3af', fontSize: '0.78rem', lineHeight: '1.4', flex: 1 }}>
                                    {ability.description
                                        ? ability.description.length > 80
                                            ? ability.description.slice(0, 80) + '...'
                                            : ability.description
                                        : 'No description available.'}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                                    <span style={{ backgroundColor: '#dc2626', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                                        {getIcon(ability.name)} {ability.count} Pokémon
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && !loadingDetails && totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{
                            backgroundColor: page === 1 ? '#374151' : '#dc2626', color: 'white',
                            border: 'none', borderRadius: '9999px', padding: '0.5rem 1.25rem',
                            fontWeight: 'bold', cursor: page === 1 ? 'not-allowed' : 'pointer'
                        }}
                    >← Prev</button>
                    <span style={{ color: '#9ca3af' }}>Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{
                            backgroundColor: page === totalPages ? '#374151' : '#dc2626', color: 'white',
                            border: 'none', borderRadius: '9999px', padding: '0.5rem 1.25rem',
                            fontWeight: 'bold', cursor: page === totalPages ? 'not-allowed' : 'pointer'
                        }}
                    >Next →</button>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default AbilitiesPage