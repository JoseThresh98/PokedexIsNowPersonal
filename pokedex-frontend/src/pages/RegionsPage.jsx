import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRegionList } from '../services/pokemonService'
import { regionColors, regionIcons, regionData } from '../data/regionData'
import PageHeader from '../components/PageHeader'

function RegionsPage() {
    const [regions, setRegions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const data = await getRegionList()
                setRegions(data.results)
            } finally {
                setLoading(false)
            }
        }
        fetchRegions()
    }, [])

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <PageHeader
                title="Regions"
                icon="🌍"
                subtitle="Explore every Pokémon region — click one to discover its routes, gyms, and legendaries"
            />

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div style={{ width: '3rem', height: '3rem', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            )}

            {!loading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {regions.map(region => {
                        const data = regionData[region.name]
                        const color = regionColors[region.name] ?? '#374151'
                        const icon = regionIcons[region.name] ?? '🌍'
                        return (
                            <Link key={region.name} to={`/regions/${region.name}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    backgroundColor: '#1f2937', borderRadius: '1.5rem', overflow: 'hidden',
                                    border: '2px solid transparent', transition: 'all 0.2s', cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)' }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
                                >
                                    {/* Color bar */}
                                    <div style={{ backgroundColor: color, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontSize: '2.5rem' }}>{icon}</span>
                                        <div>
                                            <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.4rem', textTransform: 'capitalize', margin: 0 }}>
                                                {region.name}
                                            </h3>
                                            {data && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', margin: '0.2rem 0 0' }}>{data.game}</p>}
                                        </div>
                                    </div>
                                    {/* Info */}
                                    <div style={{ padding: '1rem 1.5rem' }}>
                                        {data
                                            ? <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                                                {data.description.length > 100 ? data.description.slice(0, 100) + '...' : data.description}
                                            </p>
                                            : <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Details coming soon...</p>
                                        }
                                        {data && (
                                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
                                                <span style={{ backgroundColor: '#374151', color: '#d1d5db', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                                                    🏆 {data.gyms?.length ?? 0} Gyms
                                                </span>
                                                <span style={{ backgroundColor: '#374151', color: '#d1d5db', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                                                    ⚔️ {data.eliteFour?.length ?? 0} Elite Four
                                                </span>
                                                <span style={{ backgroundColor: '#374151', color: '#d1d5db', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                                                    ✨ {data.legendaries?.length ?? 0} Legendaries
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default RegionsPage