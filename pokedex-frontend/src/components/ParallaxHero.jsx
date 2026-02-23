import { useEffect, useRef } from 'react'

/**
 * ParallaxHero
 * A full-width hero section with 3-layer mouse-tracking parallax.
 * Props:
 *  - children: content overlaid on top of the parallax
 *  - height: CSS height string (default '480px')
 *  - overlayOpacity: darkness of the overlay (default 0.55)
 */
function ParallaxHero({ children, height = '480px', overlayOpacity = 0.55 }) {
    const bgRef = useRef(null)
    const midRef = useRef(null)
    const fgRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { innerWidth: W, innerHeight: H } = window
            // -1 to 1 range
            const x = (e.clientX / W - 0.5) * 2
            const y = (e.clientY / H - 0.5) * 2

            if (bgRef.current) bgRef.current.style.transform = `translate(${x * -12}px, ${y * -8}px) scale(1.08)`
            if (midRef.current) midRef.current.style.transform = `translate(${x * -6}px,  ${y * -4}px) scale(1.06)`
            if (fgRef.current) fgRef.current.style.transform = `translate(${x * -2}px,  ${y * -1.5}px) scale(1.04)`
        }

        // Reset on mouse leave
        const handleMouseLeave = () => {
            if (bgRef.current) bgRef.current.style.transform = 'translate(0,0) scale(1.08)'
            if (midRef.current) midRef.current.style.transform = 'translate(0,0) scale(1.06)'
            if (fgRef.current) fgRef.current.style.transform = 'translate(0,0) scale(1.04)'
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseleave', handleMouseLeave)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    const layerBase = {
        position: 'absolute',
        inset: '-5%',
        width: '110%',
        height: '110%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'transform 0.12s ease-out',
        willChange: 'transform',
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height,
                overflow: 'hidden',
                backgroundColor: '#080b10',
            }}
        >
            {/* Layer 1 — blurred background */}
            <div
                ref={bgRef}
                style={{
                    ...layerBase,
                    backgroundImage: 'url(/layer_bg.webp)',
                    transform: 'translate(0,0) scale(1.08)',
                }}
            />

            {/* Layer 2 — sharp midground */}
            <div
                ref={midRef}
                style={{
                    ...layerBase,
                    backgroundImage: 'url(/layer_mid.webp)',
                    transform: 'translate(0,0) scale(1.06)',
                }}
            />

            {/* Layer 3 — foreground */}
            <div
                ref={fgRef}
                style={{
                    ...layerBase,
                    backgroundImage: 'url(/layer_fg.webp)',
                    transform: 'translate(0,0) scale(1.04)',
                }}
            />

            {/* Dark gradient overlay so text stays readable */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(
          to bottom,
          rgba(8,11,16,${overlayOpacity * 0.6}) 0%,
          rgba(8,11,16,${overlayOpacity * 0.3}) 40%,
          rgba(8,11,16,${overlayOpacity * 0.8}) 80%,
          rgba(8,11,16,1) 100%
        )`,
                pointerEvents: 'none',
            }} />

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '0 0 2.5rem',
            }}>
                {children}
            </div>
        </div>
    )
}

export default ParallaxHero