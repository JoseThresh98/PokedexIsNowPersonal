const DEX = {
    red: '#cc2020', redDark: '#a81a1a', black: '#111111',
    blue: '#42b0e8', yellow: '#fbbf24', green: '#22c55e',
}

function PageHeader({ title, subtitle, icon = '📖', search, onSearch, placeholder = 'Search...' }) {
    return (
        <div style={{
            backgroundColor: DEX.red,
            border: `3px solid ${DEX.black}`,
            borderRadius: '1.75rem',
            padding: '1.75rem 2rem',
            marginBottom: '1.75rem',
            boxShadow: `4px 4px 0 ${DEX.black}, 0 12px 40px rgba(204,32,32,0.3)`,
            position: 'relative',
            overflow: 'hidden',
        }}>

            {/* Decorative dots — top right */}
            <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', display: 'flex', gap: '0.4rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: DEX.yellow, border: `2px solid ${DEX.black}` }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: DEX.green, border: `2px solid ${DEX.black}` }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: DEX.blue, border: `2px solid ${DEX.black}` }} />
            </div>

            {/* Circuit line decoration */}
            <svg
                style={{ position: 'absolute', right: '3rem', bottom: 0, height: '100%', width: '35%', opacity: 0.15, pointerEvents: 'none' }}
                viewBox="0 0 120 80" preserveAspectRatio="none"
            >
                <path d="M0 60 Q30 60 45 30 L120 30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M85 30 L85 80" stroke="white" strokeWidth="3" fill="none" />
            </svg>

            <p style={{
                color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: '0 0 0.3rem',
                fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
                Pokédex 2.0
            </p>

            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{icon}</span> {title}
            </h1>

            {subtitle && (
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: '0 0 1.25rem' }}>
                    {subtitle}
                </p>
            )}

            {/* Search bar — only renders if onSearch is provided */}
            {onSearch && (
                <div style={{ position: 'relative', maxWidth: '380px', marginTop: subtitle ? 0 : '1.25rem' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={search}
                        onChange={e => onSearch(e.target.value)}
                        style={{
                            width: '100%', backgroundColor: 'rgba(0,0,0,0.35)',
                            color: 'white', border: '2px solid rgba(255,255,255,0.25)',
                            borderRadius: '9999px', padding: '0.6rem 1.25rem 0.6rem 2.75rem',
                            fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                        }}
                        onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.7)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.25)'}
                    />
                </div>
            )}
        </div>
    )
}

export default PageHeader