import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const DEX = {
    red: '#cc2020', black: '#111111',
    yellow: '#fbbf24', green: '#22c55e', blue: '#42b0e8',
}

const navLinks = [
    { path: '/', label: 'Search', icon: '🔍' },
    { path: '/pokedex', label: 'Pokédex', icon: '📖' },
    { path: '/abilities', label: 'Abilities', icon: '⚡' },
    { path: '/types', label: 'Types', icon: '🔥' },
    { path: '/regions', label: 'Regions', icon: '🌍' },
    { path: '/rarity', label: 'Rarity', icon: '🌟' },
    { path: '/items', label: 'Items', icon: '🎒' },
]

function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    const isActive = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

    return (
        <>
            <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-desktop-links { display: flex !important; }
          .nav-hamburger { display: none !important; }
        }
      `}</style>

            <nav style={{
                backgroundColor: '#0d0d0d',
                borderBottom: `3px solid ${DEX.black}`,
                padding: '0 1.5rem',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}>

                {/* Left: logo + title */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
                    <img
                        src="/logo.png"
                        alt="logo"
                        style={{ width: '3.5rem', height: '3.5rem', objectFit: 'contain', flexShrink: 0 }}
                    />
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
                        Pokédex <span style={{ color: DEX.red }}>2.0</span>
                    </span>
                </Link>

                {/* Center/right: desktop nav links */}
                <div
                    className="nav-desktop-links"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                    {navLinks.map(link => {
                        const active = isActive(link.path)
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                style={{
                                    textDecoration: 'none',
                                    color: active ? 'white' : '#9ca3af',
                                    fontWeight: active ? '700' : '500',
                                    fontSize: '0.9rem',
                                    padding: '0.45rem 0.85rem',
                                    borderRadius: '0.6rem',
                                    backgroundColor: active ? DEX.red : 'transparent',
                                    transition: 'all 0.18s',
                                    whiteSpace: 'nowrap',
                                    border: active ? `2px solid ${DEX.black}` : '2px solid transparent',
                                    boxShadow: active ? `2px 2px 0 ${DEX.black}` : 'none',
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'white'; if (!active) e.currentTarget.style.backgroundColor = '#1f2937' }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#9ca3af'; if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
                            >
                                {link.icon} {link.label}
                            </Link>
                        )
                    })}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="nav-hamburger"
                    onClick={() => setSidebarOpen(true)}
                    style={{
                        display: 'none', flexDirection: 'column', gap: '5px',
                        backgroundColor: 'transparent', border: 'none',
                        cursor: 'pointer', padding: '0.5rem', outline: 'none',
                    }}
                >
                    <span style={{ display: 'block', width: '24px', height: '2.5px', backgroundColor: 'white', borderRadius: '2px', transition: 'all 0.2s' }} />
                    <span style={{ display: 'block', width: '24px', height: '2.5px', backgroundColor: 'white', borderRadius: '2px', transition: 'all 0.2s' }} />
                    <span style={{ display: 'block', width: '16px', height: '2.5px', backgroundColor: DEX.red, borderRadius: '2px', transition: 'all 0.2s' }} />
                </button>
            </nav>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
                        zIndex: 200, backdropFilter: 'blur(3px)',
                    }}
                />
            )}

            {/* Mobile sidebar */}
            <div style={{
                position: 'fixed', top: 0, left: 0, height: '100%',
                width: '280px', backgroundColor: '#0d0d0d',
                borderRight: `3px solid ${DEX.black}`,
                zIndex: 300, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease',
                display: 'flex', flexDirection: 'column',
                boxShadow: sidebarOpen ? '8px 0 40px rgba(0,0,0,0.6)' : 'none',
            }}>

                {/* Sidebar header */}
                <div style={{
                    padding: '1rem 1.25rem',
                    borderBottom: `2px solid #1f2937`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img src="/logo.png" alt="logo" style={{ width: '2.75rem', height: '2.75rem', objectFit: 'contain' }} />
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                            Pokédex <span style={{ color: DEX.red }}>2.0</span>
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            backgroundColor: '#1f2937', border: 'none', color: 'white',
                            width: '32px', height: '32px', borderRadius: '50%',
                            cursor: 'pointer', fontSize: '1rem', outline: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Sidebar links */}
                <div style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {navLinks.map(link => {
                        const active = isActive(link.path)
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setSidebarOpen(false)}
                                style={{
                                    textDecoration: 'none', padding: '0.75rem 1rem',
                                    borderRadius: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.85rem',
                                    backgroundColor: active ? DEX.red : 'transparent',
                                    color: active ? 'white' : '#9ca3af',
                                    fontWeight: active ? '700' : '500',
                                    fontSize: '0.95rem', transition: 'all 0.15s',
                                    border: active ? `2px solid ${DEX.black}` : '2px solid transparent',
                                    boxShadow: active ? `2px 2px 0 ${DEX.black}` : 'none',
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
                                {link.label}
                            </Link>
                        )
                    })}
                </div>

                {/* Sidebar footer dots */}
                <div style={{ marginTop: 'auto', padding: '1.25rem', display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                    {[DEX.red, DEX.yellow, DEX.green, DEX.blue].map((c, i) => (
                        <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c, border: `2px solid ${DEX.black}` }} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Navbar