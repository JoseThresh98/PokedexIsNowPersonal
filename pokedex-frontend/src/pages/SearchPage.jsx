import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPokemonDetail } from '../services/pokemonService'

const DEX = {
    red: '#cc2020', black: '#111111',
    yellow: '#fbbf24', green: '#22c55e', blue: '#42b0e8',
}

const typeColors = {
    fire: '#b91c1c', water: '#1d4ed8', grass: '#15803d', electric: '#a16207',
    psychic: '#be185d', ice: '#0e7490', dragon: '#4338ca', dark: '#1f2937',
    fairy: '#9d174d', fighting: '#7f1d1d', poison: '#6b21a8', ground: '#92400e',
    rock: '#78350f', bug: '#3f6212', ghost: '#4c1d95', steel: '#4b5563',
    flying: '#075985', normal: '#374151',
}

const QUICK_SEARCHES = [
    'pikachu', 'charizard', 'mewtwo', 'eevee', 'gengar',
    'snorlax', 'lucario', 'garchomp', 'rayquaza', 'umbreon',
]

function SearchPage() {
    const [query, setQuery] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const debounceRef = useRef(null)
    const navigate = useNavigate()

    const doSearch = async (term) => {
        const t = term.trim().toLowerCase()
        if (!t) { setResult(null); setError(null); return }
        setLoading(true)
        setError(null)
        setResult(null)
        try {
            const data = await getPokemonDetail(t)
            setResult(data)
        } catch {
            setError(`No Pokémon found for "${term}".`)
        } finally {
            setLoading(false)
        }
    }

    // Live search: debounce 500ms after user stops typing
    useEffect(() => {
        if (!query.trim()) {
            setResult(null)
            setError(null)
            return
        }
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            doSearch(query)
        }, 500)
        return () => clearTimeout(debounceRef.current)
    }, [query])

    const handleQuick = (name) => {
        setQuery(name)
        clearTimeout(debounceRef.current)
        doSearch(name)
    }

    const hasContent = loading || result || error

    return (
        <div style={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: hasContent ? 'flex-start' : 'center',
            padding: hasContent ? '3.5rem 1rem' : '0 1rem',
            paddingBottom: '4rem',
            transition: 'justify-content 0.3s',
        }}>

            {/* ── Hero ── */}
            <div style={{ width: '100%', maxWidth: '620px', textAlign: 'center', marginBottom: '2rem' }}>
                <p style={{
                    color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem',
                    fontWeight: '700', letterSpacing: '0.14em',
                    textTransform: 'uppercase', margin: '0 0 0.5rem',
                }}>
                    Pokédex 2.0
                </p>
                <h1 style={{
                    color: 'white',
                    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                    fontWeight: 'bold',
                    margin: '0 0 0.5rem',
                    textShadow: '0 4px 30px rgba(0,0,0,0.9)',
                    lineHeight: 1.1,
                }}>
                    Find any Pokémon
                </h1>
                <p style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '1rem',
                    margin: '0 0 2rem',
                    textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                }}>
                    Search by name or Pokédex number
                </p>

                {/* Search bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(16px)',
                    border: '2px solid rgba(255,255,255,0.15)',
                    borderRadius: '9999px',
                    padding: '0.4rem 0.4rem 0.4rem 1.25rem',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                }}>
                    {/* Spinner or magnifier */}
                    {loading
                        ? <div style={{ width: '18px', height: '18px', border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: DEX.red, borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                        : <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🔍</span>
                    }
                    <input
                        type="text"
                        placeholder='Try "pikachu" or "25"...'
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { clearTimeout(debounceRef.current); doSearch(query) } }}
                        autoFocus
                        style={{
                            flex: 1, backgroundColor: 'transparent',
                            color: 'white', border: 'none', outline: 'none',
                            fontSize: '1.05rem', padding: '0.5rem 0',
                        }}
                    />
                    {query && (
                        <button
                            onClick={() => { setQuery(''); setResult(null); setError(null) }}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.12)', border: 'none',
                                color: 'white', borderRadius: '50%', width: '28px', height: '28px',
                                cursor: 'pointer', flexShrink: 0, fontSize: '0.75rem', outline: 'none',
                            }}
                        >✕</button>
                    )}
                    <button
                        onClick={() => { clearTimeout(debounceRef.current); doSearch(query) }}
                        style={{
                            backgroundColor: DEX.red, color: 'white',
                            border: `2px solid ${DEX.black}`, borderRadius: '9999px',
                            padding: '0.6rem 1.5rem', fontWeight: 'bold', fontSize: '0.95rem',
                            cursor: 'pointer', outline: 'none', flexShrink: 0,
                            boxShadow: `2px 2px 0 ${DEX.black}`, transition: 'background 0.18s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#a81a1a'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = DEX.red}
                    >
                        Search →
                    </button>
                </div>

                {/* Quick search pills */}
                <div style={{ marginTop: '1.25rem' }}>
                    <p style={{
                        color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem',
                        fontWeight: '700', textTransform: 'uppercase',
                        letterSpacing: '0.08em', marginBottom: '0.6rem',
                    }}>
                        Quick search
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                        {QUICK_SEARCHES.map(name => (
                            <button
                                key={name}
                                onClick={() => handleQuick(name)}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'rgba(255,255,255,0.75)',
                                    border: '1.5px solid rgba(255,255,255,0.15)',
                                    borderRadius: '9999px',
                                    padding: '0.3rem 0.9rem',
                                    fontSize: '0.82rem', fontWeight: '600',
                                    cursor: 'pointer', textTransform: 'capitalize',
                                    transition: 'all 0.18s', outline: 'none',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = DEX.red; e.currentTarget.style.borderColor = DEX.red; e.currentTarget.style.color = 'white' }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Error ── */}
            {error && !loading && (
                <div style={{
                    maxWidth: '500px', width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)',
                    borderRadius: '1.5rem', padding: '2rem', textAlign: 'center',
                    border: '2px solid rgba(255,255,255,0.1)',
                }}>
                    <p style={{ fontSize: '2.5rem', margin: '0 0 0.5rem' }}>😔</p>
                    <p style={{ color: '#9ca3af', margin: 0 }}>{error}</p>
                </div>
            )}

            {/* ── Result card ── */}
            {result && !loading && (
                <div
                    onClick={() => navigate(`/pokemon/${result.name}`)}
                    style={{
                        maxWidth: '520px', width: '100%',
                        backgroundColor: 'rgba(15,20,30,0.85)',
                        backdropFilter: 'blur(20px)',
                        border: `3px solid ${DEX.black}`,
                        borderRadius: '1.75rem', overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: `4px 4px 0 ${DEX.black}, 0 20px 60px rgba(0,0,0,0.7)`,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `4px 8px 0 ${DEX.black}, 0 24px 60px rgba(204,32,32,0.3)` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `4px 4px 0 ${DEX.black}, 0 20px 60px rgba(0,0,0,0.7)` }}
                >
                    <div style={{
                        background: `linear-gradient(135deg, ${DEX.red} 0%, #1a0a0a 100%)`,
                        padding: '1.5rem 1.75rem',
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                    }}>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace', fontSize: '0.8rem', margin: '0 0 0.2rem' }}>
                                #{String(result.id).padStart(3, '0')}
                            </p>
                            <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '2rem', textTransform: 'capitalize', margin: '0 0 0.65rem' }}>
                                {result.name}
                            </h2>
                            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                                {result.types.map(type => (
                                    <span key={type} style={{
                                        backgroundColor: typeColors[type] ?? '#374151',
                                        color: 'white', fontSize: '0.8rem', fontWeight: 'bold',
                                        padding: '0.25rem 0.85rem', borderRadius: '9999px', textTransform: 'capitalize',
                                    }}>{type}</span>
                                ))}
                            </div>
                        </div>
                        <img src={result.imageUrl} alt={result.name} style={{ width: '120px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.7))' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '2px solid rgba(255,255,255,0.08)' }}>
                        {[
                            { label: 'Height', value: `${result.height / 10} m` },
                            { label: 'Weight', value: `${result.weight / 10} kg` },
                            { label: 'Base XP', value: result.baseExperience ?? '—' },
                        ].map((item, i) => (
                            <div key={item.label} style={{ padding: '1rem', textAlign: 'center', borderRight: i < 2 ? '2px solid rgba(255,255,255,0.08)' : 'none' }}>
                                <p style={{ color: '#6b7280', fontSize: '0.72rem', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                                <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '0.85rem', textAlign: 'center', borderTop: '2px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        <span style={{ color: DEX.red, fontWeight: 'bold', fontSize: '0.9rem' }}>View full details →</span>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default SearchPage