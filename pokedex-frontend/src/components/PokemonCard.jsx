import { Link } from 'react-router-dom'

const typeColors = {
    fire: '#b91c1c', water: '#1d4ed8', grass: '#15803d', electric: '#a16207',
    psychic: '#be185d', ice: '#0e7490', dragon: '#4338ca', dark: '#1f2937',
    fairy: '#9d174d', fighting: '#7f1d1d', poison: '#6b21a8', ground: '#92400e',
    rock: '#78350f', bug: '#3f6212', ghost: '#4c1d95', steel: '#4b5563',
    flying: '#075985', normal: '#374151',
}

function PokemonCard({ pokemon, onClick }) {
    const { id, name, types, imageUrl } = pokemon

    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: 'rgba(20, 27, 40, 0.82)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.07)',
                borderRadius: '1.2rem',
                padding: '1rem 0.75rem 0.85rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden',
                userSelect: 'none',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.borderColor = 'rgba(204,32,32,0.6)'
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.6), 0 4px 15px rgba(204,32,32,0.2)'
                e.currentTarget.style.backgroundColor = 'rgba(30, 38, 55, 0.92)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.3)'
                e.currentTarget.style.backgroundColor = 'rgba(20, 27, 40, 0.82)'
            }}
        >
            {/* ID badge */}
            <span style={{
                alignSelf: 'flex-end',
                color: 'rgba(255,255,255,0.35)',
                fontSize: '0.65rem',
                fontFamily: 'monospace',
                fontWeight: '600',
            }}>
                #{String(id).padStart(3, '0')}
            </span>

            {/* Sprite */}
            <div style={{
                width: '90px', height: '90px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
            }}>
                {/* Subtle glow behind sprite */}
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <img
                    src={imageUrl}
                    alt={name}
                    style={{
                        width: '80px', height: '80px', objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))',
                        position: 'relative', zIndex: 1,
                    }}
                />
            </div>

            {/* Name */}
            <p style={{
                color: 'white', fontWeight: '700',
                textTransform: 'capitalize', fontSize: '0.85rem',
                margin: 0, textAlign: 'center', lineHeight: 1.2,
            }}>
                {name}
            </p>

            {/* Types */}
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {types.map(type => (
                    <span key={type} style={{
                        backgroundColor: typeColors[type] ?? '#374151',
                        color: 'white', fontSize: '0.68rem', fontWeight: '700',
                        padding: '0.15rem 0.55rem', borderRadius: '9999px',
                        textTransform: 'capitalize',
                    }}>
                        {type}
                    </span>
                ))}
            </div>

            {/* See Details button */}
            <button style={{
                marginTop: '0.25rem',
                backgroundColor: '#cc2020',
                color: 'white',
                border: '2px solid #111',
                borderRadius: '9999px',
                padding: '0.3rem 0.9rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '2px 2px 0 #111',
                width: '100%',
                transition: 'background 0.15s',
                userSelect: 'none',
            }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#a81a1a'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#cc2020'}
            >
                See Details →
            </button>
        </div>
    )
}

export default PokemonCard