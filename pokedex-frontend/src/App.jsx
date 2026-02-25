import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchPage from './pages/SearchPage'
import PokedexPage from './pages/PokedexPage'
import PokemonDetailPage from './pages/PokemonDetailPage'
import AbilitiesPage from './pages/AbilitiesPage'
import AbilityDetailPage from './pages/AbilityDetailPage'
import TypesPage from './pages/TypesPage'
import TypeDetailPage from './pages/TypeDetailPage'
import RegionsPage from './pages/RegionsPage'
import RegionDetailPage from './pages/RegionDetailPage'
import RouteDetailPage from './pages/RouteDetailPage'
import RarityPage from './pages/RarityPage'
import TrainerDetailPage from './pages/TrainerDetailPage'
import ItemsPage from './pages/ItemsPage'
import ItemDetailPage from './pages/ItemDetailPage'


function App() {
    // Inject parallax layers into <body> and track mouse
    useEffect(() => {
        // Create layers
        const layers = [
            { id: 'parallax-bg' },
            { id: 'parallax-mid' },
            { id: 'parallax-fg' },
            { id: 'parallax-overlay' },
        ]
        layers.forEach(({ id }) => {
            if (!document.getElementById(id)) {
                const el = document.createElement('div')
                el.id = id
                document.body.insertBefore(el, document.body.firstChild)
            }
        })

        const bg = document.getElementById('parallax-bg')
        const mid = document.getElementById('parallax-mid')
        const fg = document.getElementById('parallax-fg')

        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2
            const y = (e.clientY / window.innerHeight - 0.5) * 2
            if (bg) bg.style.transform = `translate(${x * -14}px, ${y * -9}px)`
            if (mid) mid.style.transform = `translate(${x * -7}px,  ${y * -4.5}px)`
            if (fg) fg.style.transform = `translate(${x * -2.5}px,${y * -1.5}px)`
        }

        const handleMouseLeave = () => {
            if (bg) bg.style.transform = 'translate(0,0)'
            if (mid) mid.style.transform = 'translate(0,0)'
            if (fg) fg.style.transform = 'translate(0,0)'
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseleave', handleMouseLeave)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    return (
        <Router>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<SearchPage />} />
                    <Route path="/pokedex" element={<PokedexPage />} />
                    <Route path="/pokemon/:nameOrId" element={<PokemonDetailPage />} />
                    <Route path="/abilities" element={<AbilitiesPage />} />
                    <Route path="/abilities/:name" element={<AbilityDetailPage />} />
                    <Route path="/types" element={<TypesPage />} />
                    <Route path="/types/:name" element={<TypeDetailPage />} />
                    <Route path="/regions" element={<RegionsPage />} />
                    <Route path="/regions/:name" element={<RegionDetailPage />} />
                    <Route path="/regions/:regionName/routes/:routeName" element={<RouteDetailPage />} />
                    <Route path="/rarity" element={<RarityPage />} />
                    <Route path="/trainer/:trainerId" element={<TrainerDetailPage />} />
                    <Route path="/items" element={<ItemsPage />} />
                    <Route path="/items/:name" element={<ItemDetailPage />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    )
}

export default App