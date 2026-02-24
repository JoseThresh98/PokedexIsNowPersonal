import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { trainerData, typeColors } from '../data/trainerData'

const DEX = { red: '#cc2020', black: '#111111' }

const roleColors = {
    'Gym Leader': '#f59e0b',
    'Elite Four': '#a855f7',
    'Champion': '#cc2020',
}

function TrainerDetailPage() {
    const { trainerId } = useParams()
    const trainer = trainerData[trainerId]
    const [teamDetails, setTeamDetails] = useState({})
    const [loadingTeam, setLoadingTeam] = useState(true)

    useEffect(() => {
        if (!trainer) return
        let cancelled = false

        const run = async () => {
            setLoadingTeam(true)
            setTeamDetails({})

            const results = await Promise.all(
                trainer.team.map(member =>
                    fetch(`https://pokeapi.co/api/v2/pokemon/${member.name}`)
                        .then(r => r.json())
                        .then(d => ({
                            name: member.name,
                            level: member.level,
                            id: d.id,
                            types: d.types.map(t => t.type.name),
                            sprite: d.sprites?.other?.['official-artwork']?.front_default ?? d.sprites?.front_default ?? null,
                        }))
                        .catch(() => ({ name: member.name, level: member.level, id: null, types: [], sprite: null }))
                )
            )

            if (!cancelled) {
                const map = {}
                results.forEach(r => { map[r.name] = r })
                setTeamDetails(map)
                setLoadingTeam(false)
            }
        }

        run()
        return () => { cancelled = true }
    }, [trainerId])

    if (!trainer) return (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
            <p style={{ fontSize: '2rem' }}>😔</p>
            <p>Trainer not found: <code style={{ background: "#374151", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>{trainerId}</code></p>
            <Link to="/regions" style={{ color: DEX.red }}>← Back to Regions</Link>
        </div>
    )

    const roleColor = roleColors[trainer.role] ?? DEX.red
    const typeBg = typeColors[trainer.type?.toLowerCase()] ?? '#374151'

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1rem 5rem' }}>

            {/* Back link */}
            <Link
                to={`/regions/${trainer.region}`}
                style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.25rem' }}
            >
                ← Back to {trainer.region.charAt(0).toUpperCase() + trainer.region.slice(1)}
            </Link>

            {/* ── Hero card ── */}
            <div style={{
                backgroundColor: typeBg,
                border: `3px solid ${DEX.black}`,
                borderRadius: '1.75rem',
                padding: '2rem',
                marginBottom: '1.5rem',
                boxShadow: `4px 4px 0 ${DEX.black}`,
                display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative dots */}
                <div style={{ position: 'absolute', top: '1rem', right: '1.25rem', display: 'flex', gap: '0.35rem' }}>
                    <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#fbbf24', border: `2px solid ${DEX.black}` }} />
                    <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#22c55e', border: `2px solid ${DEX.black}` }} />
                    <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#42b0e8', border: `2px solid ${DEX.black}` }} />
                </div>

                {/* Trainer sprite */}
                <img
                    src={trainer.sprite}
                    alt={trainer.name}
                    onError={e => { e.target.style.display = 'none' }}
                    style={{
                        height: '140px', width: 'auto', objectFit: 'contain',
                        filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))',
                        flexShrink: 0,
                    }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                    {/* Role badge */}
                    <span style={{
                        backgroundColor: roleColor, color: 'white',
                        fontSize: '0.7rem', fontWeight: 'bold', padding: '0.2rem 0.65rem',
                        borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em',
                        border: `1.5px solid ${DEX.black}`, display: 'inline-block', marginBottom: '0.5rem',
                    }}>
                        {trainer.role}
                    </span>

                    <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.25rem', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                        {trainer.name}
                    </h1>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        {trainer.city && (
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                                📍 {trainer.city}
                            </span>
                        )}
                        <span style={{
                            backgroundColor: 'rgba(0,0,0,0.3)', color: 'white',
                            fontSize: '0.8rem', fontWeight: 'bold', padding: '0.15rem 0.6rem',
                            borderRadius: '9999px', textTransform: 'capitalize',
                        }}>
                            {trainer.type} type
                        </span>
                    </div>

                    {trainer.badge && (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '9999px',
                            padding: '0.3rem 0.85rem', border: '1.5px solid rgba(255,255,255,0.3)',
                        }}>
                            <span>🏅</span>
                            <span style={{ color: '#fde047', fontSize: '0.85rem', fontWeight: 'bold' }}>{trainer.badge}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Quote ── */}
            {trainer.quote && (
                <div style={{
                    backgroundColor: '#1f2937', borderRadius: '1.25rem', padding: '1.25rem 1.5rem',
                    marginBottom: '1.5rem', border: `2px solid #374151`,
                    borderLeft: `4px solid ${roleColor}`,
                }}>
                    <p style={{ color: '#d1d5db', fontStyle: 'italic', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>
                        "{trainer.quote}"
                    </p>
                </div>
            )}

            {/* ── Team ── */}
            <div style={{ backgroundColor: '#1f2937', borderRadius: '1.75rem', padding: '1.5rem', border: `2px solid #374151` }}>
                <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🎮 Battle Team
                    <span style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 'normal' }}>
                        ({trainer.team.length} Pokémon)
                    </span>
                </h2>

                {loadingTeam ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', border: `4px solid ${DEX.red}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.85rem' }}>
                        {trainer.team.map((member, i) => {
                            const detail = teamDetails[member.name]
                            return (
                                <Link key={`${member.name}-${i}`} to={`/pokemon/${member.name}`} style={{ textDecoration: 'none' }}>
                                    <div
                                        style={{
                                            backgroundColor: '#374151', borderRadius: '1.25rem', padding: '1rem',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                                            border: '2px solid transparent', transition: 'all 0.2s', cursor: 'pointer',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = roleColor; e.currentTarget.style.transform = 'translateY(-3px)' }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
                                    >
                                        {detail?.id && (
                                            <span style={{ color: '#6b7280', fontSize: '0.65rem', fontFamily: 'monospace', alignSelf: 'flex-end' }}>
                                                #{String(detail.id).padStart(3, '0')}
                                            </span>
                                        )}
                                        {detail?.sprite ? (
                                            <img src={detail.sprite} alt={member.name} style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))' }} />
                                        ) : (
                                            <div style={{ width: '80px', height: '80px', backgroundColor: '#4b5563', borderRadius: '50%' }} />
                                        )}
                                        <p style={{ color: 'white', fontWeight: 'bold', textTransform: 'capitalize', fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>
                                            {member.name.replace(/-/g, ' ')}
                                        </p>
                                        <span style={{
                                            backgroundColor: 'rgba(0,0,0,0.4)', color: '#fde047',
                                            fontSize: '0.7rem', fontWeight: 'bold', padding: '0.1rem 0.5rem', borderRadius: '9999px',
                                        }}>
                                            Lv. {member.level}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                            {detail?.types?.map(type => (
                                                <span key={type} style={{
                                                    backgroundColor: typeColors[type] ?? '#374151', color: 'white',
                                                    fontSize: '0.6rem', fontWeight: 'bold', padding: '0.1rem 0.4rem', borderRadius: '9999px', textTransform: 'capitalize',
                                                }}>{type}</span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default TrainerDetailPage