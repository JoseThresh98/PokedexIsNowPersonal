
const DEX = { red: '#cc2020', black: '#111111' }

function PageHeader({
    icon,
    title,
    subtitle,
    searchValue,
    onSearch,
    searchPlaceholder = 'Search...',
    children,
}) {
    const hasSearch = onSearch !== undefined

    return (
        <div style={{
            backgroundColor: DEX.red,
            border: `3px solid ${DEX.black}`,
            borderRadius: '1.5rem',
            padding: '1.25rem 1.5rem 1.35rem',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `4px 4px 0 ${DEX.black}, 0 12px 40px rgba(0,0,0,0.5)`,
        }}>

            {/* Traffic-light dots */}
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.4rem', zIndex: 1 }}>
                <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#fbbf24', border: `2px solid ${DEX.black}` }} />
                <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#22c55e', border: `2px solid ${DEX.black}` }} />
                <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#42b0e8', border: `2px solid ${DEX.black}` }} />
            </div>

            {/* Circuit decoration */}
            <svg
                style={{ position: 'absolute', right: '2.5rem', top: 0, height: '100%', width: '40%', opacity: 0.15, pointerEvents: 'none' }}
                viewBox="0 0 120 80"
                preserveAspectRatio="none"
            >
                <path d="M0 60 Q30 60 40 30 L120 30" stroke={DEX.black} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M85 30 L85 80" stroke={DEX.black} strokeWidth="3" fill="none" />
                <circle cx="85" cy="30" r="4" fill={DEX.black} />
                <circle cx="40" cy="30" r="3" fill={DEX.black} />
            </svg>

            {/* Label */}
            <p style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: '0.7rem',
                fontWeight: '700',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                margin: '0 0 0.35rem',
            }}>
                Pokédex 2.0
            </p>

            {/* Title row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: subtitle || hasSearch || children ? '0.6rem' : 0, flexWrap: 'wrap' }}>
                {icon && <span style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 1 }}>{icon}</span>}
                <h1 style={{
                    color: 'white',
                    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                    fontWeight: 'bold',
                    margin: 0,
                    textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}>
                    {title}
                </h1>
            </div>

            {/* Subtitle */}
            {subtitle && (
                <p style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    margin: '0 0 0.85rem',
                }}>
                    {subtitle}
                </p>
            )}

            {/* Search bar */}
            {hasSearch && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(8px)',
                    border: '2px solid rgba(0,0,0,0.4)',
                    borderRadius: '9999px',
                    padding: '0.35rem 0.35rem 0.35rem 1.1rem',
                    maxWidth: '420px',
                }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>🔍</span>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={e => onSearch(e.target.value)}
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: 'none',
                            outline: 'none',
                            fontSize: '0.9rem',
                            padding: '0.35rem 0',
                        }}
                    />
                    {searchValue && (
                        <button
                            onClick={() => onSearch('')}
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                border: 'none', color: 'white',
                                borderRadius: '50%', width: '26px', height: '26px',
                                cursor: 'pointer', flexShrink: 0,
                                fontSize: '0.75rem', outline: 'none',
                            }}
                        >✕</button>
                    )}
                </div>
            )}

            {/* Extra slot (e.g. filter tabs) */}
            {children && (
                <div style={{ marginTop: '0.85rem' }}>
                    {children}
                </div>
            )}
        </div>
    )
}

export default PageHeader