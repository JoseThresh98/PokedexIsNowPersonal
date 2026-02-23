const DEX = {
    red: '#cc2020', black: '#111111',
    yellow: '#fbbf24', green: '#22c55e', blue: '#42b0e8',
}

const APP_VERSION = '2.0.0'

function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer style={{
            backgroundColor: '#0d0d0d',
            borderTop: `3px solid ${DEX.black}`,
            padding: '2.5rem 1rem',
            marginTop: 'auto',
        }}>
            <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/logo.png" alt="Pokédex 2.0" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
                    <div>
                        <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>Pokedex 2.0</p>
                        <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: 0 }}>v{APP_VERSION}</p>
                    </div>
                </div>

                {/* Decorative dots */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: DEX.red, border: `2px solid ${DEX.black}` }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: DEX.yellow, border: `2px solid ${DEX.black}` }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: DEX.green, border: `2px solid ${DEX.black}` }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: DEX.blue, border: `2px solid ${DEX.black}` }} />
                </div>

                {/* Divider */}
                <div style={{ width: '100%', maxWidth: '420px', height: '1px', backgroundColor: '#1f2937' }} />

                {/* Disclaimer */}
                <p style={{
                    color: '#4b5563', fontSize: '0.75rem', textAlign: 'center',
                    maxWidth: '520px', lineHeight: '1.6', margin: 0,
                }}>
                    Pokedex 2.0 is a fan-made project for educational purposes only.
                    Pokemon and all related names are trademarks of Nintendo, Game Freak, and The Pokemon Company.
                    Data provided by <a href="https://pokeapi.co" target="_blank" rel="noreferrer" style={{ color: DEX.red, textDecoration: 'none', fontWeight: '600' }}>PokeAPI</a>.
                </p>

                {/* Year + version row */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ color: '#374151', fontSize: '0.75rem' }}>© {year} Pokedex 2.0</span>
                    <span style={{ color: '#1f2937', fontSize: '0.75rem' }}>•</span>
                    <span style={{ color: '#374151', fontSize: '0.75rem' }}>Version {APP_VERSION}</span>
                    <span style={{ color: '#1f2937', fontSize: '0.75rem' }}>•</span>
                    <span style={{ color: '#374151', fontSize: '0.75rem' }}>Fan-made project</span>
                </div>

            </div>
        </footer>
    )
}

export default Footer