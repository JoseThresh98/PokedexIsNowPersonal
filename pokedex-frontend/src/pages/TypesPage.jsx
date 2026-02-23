import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTypeList } from '../services/pokemonService'
import PageHeader from '../components/PageHeader'

const typeColors = {
    fire: '#b91c1c', water: '#1d4ed8', grass: '#15803d',
    electric: '#a16207', psychic: '#be185d', ice: '#0e7490',
    dragon: '#4338ca', dark: '#1f2937', fairy: '#9d174d',
    fighting: '#7f1d1d', poison: '#6b21a8', ground: '#92400e',
    rock: '#78350f', bug: '#3f6212', ghost: '#4c1d95',
    steel: '#4b5563', flying: '#075985', normal: '#374151',
    shadow: '#1f2937', unknown: '#374151'
}

const typeIcons = {
    fire: '🔥', water: '💧', grass: '🌿', electric: '⚡',
    psychic: '🔮', ice: '❄️', dragon: '🐉', dark: '🌑',
    fairy: '✨', fighting: '🥊', poison: '☠️', ground: '🌍',
    rock: '🪨', bug: '🐛', ghost: '👻', steel: '⚙️',
    flying: '🌪️', normal: '⭐', shadow: '🌫️', unknown: '❓'
}

function TypesPage() {
    const [types, setTypes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const data = await getTypeList()
                // Fetch each type to get pokemon count
                const details = await Promise.all(
                    data.results.map(t =>
                        fetch(t.url).then(r => r.json()).then(d => ({
                            name: d.name,
                            count: d.pokemon.length
                        }))
                    )
                )
                // Filter out types with 0 pokemon (shadow, unknown)
                setTypes(details.filter(t => t.count > 0))
            } finally {
                setLoading(false)
            }
        }
        fetchTypes()
    }, [])

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <PageHeader
                title="Types"
                subtitle="Browse all Pokémon types — click one to see its Pokémon"
                icon="🔥"
            />

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div style={{ width: '3rem', height: '3rem', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            )}

            {!loading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                    {types.map(type => (
                        <Link key={type.name} to={`/types/${type.name}`} style={{ textDecoration: 'none' }}>
                            <div style={{
                                backgroundColor: typeColors[type.name] ?? '#374151',
                                borderRadius: '1.25rem', padding: '1.5rem 1rem',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                gap: '0.6rem', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)' }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)' }}
                            >
                                <span style={{ fontSize: '2.5rem' }}>{typeIcons[type.name] ?? '❓'}</span>
                                <h3 style={{ color: 'white', fontWeight: 'bold', textTransform: 'capitalize', fontSize: '1.1rem', margin: 0 }}>
                                    {type.name}
                                </h3>
                                <span style={{ backgroundColor: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.9)', fontSize: '0.78rem', fontWeight: 'bold', padding: '0.2rem 0.65rem', borderRadius: '9999px' }}>
                                    {type.count} Pokémon
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TypesPage