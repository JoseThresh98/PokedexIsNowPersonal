# 📖 Pokédex 2.0

> A fan-made, full-stack Pokédex web application built with React and .NET 8. Browse all 1,302+ Pokémon, explore abilities, types, regions, and more — with a sleek parallax UI and live search.

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite)
![.NET](https://img.shields.io/badge/.NET-8-512bd4?style=flat-square&logo=dotnet)
![Azure](https://img.shields.io/badge/Azure-Static_Web_Apps-0078d4?style=flat-square&logo=microsoftazure)
![License](https://img.shields.io/badge/License-Fan_Made-red?style=flat-square)

---

## 🌐 Live Demo

**https://wonderful-moss-06621bf0f.2.azurestaticapps.net**

---

## ✨ Features

- 🔍 **Live Search** — Instant search across all 1,302+ Pokémon with 500ms debounce
- 📖 **Full Pokédex** — Browse all Pokémon with type badges, sprites, and pagination
- 📋 **Pokémon Detail Pages** — Stats, abilities, evolution chain, shiny toggle
- ⚡ **Abilities** — Browse and explore all Pokémon abilities
- 🎨 **Types** — Full type chart with damage relations
- 🗺️ **Regions** — Kanto through Paldea with routes, trainers, and encounter data
- ⭐ **Rarity** — Legendary, Mythical, Ultra Beasts, and Paradox Pokémon
- 📱 **Responsive** — Mobile-friendly layout across all screen sizes
- 🌌 **Parallax Background** — Full-page 3-layer parallax with mouse tracking
- 🌓 **Shiny Sprites** — Toggle between normal and shiny artwork on detail pages

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 18 | UI framework |
| [Vite](https://vitejs.dev) | 7 | Build tool & dev server |
| [React Router](https://reactrouter.com) | 6 | Client-side routing |
| JavaScript (ES2022) | — | Language |
| CSS-in-JS (inline styles) | — | Styling |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [ASP.NET Core](https://dotnet.microsoft.com) | .NET 8 | Web API |
| C# | 12 | Language |
| Newtonsoft.Json | Latest | JSON deserialization |

> **Note:** The backend is scaffolded and ready for custom API features. In production, the frontend calls [PokéAPI](https://pokeapi.co) directly.

### Data Source
| Service | Purpose |
|---|---|
| [PokéAPI](https://pokeapi.co/api/v2) | All Pokémon data (sprites, stats, abilities, types, regions) |

### Infrastructure & DevOps
| Tool | Purpose |
|---|---|
| [Azure Static Web Apps](https://azure.microsoft.com/en-us/products/app-service/static) | Frontend hosting (Free tier) |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline |
| [Azure DevOps](https://dev.azure.com) | Project management |
| Git | Version control |

---

## 📁 Project Structure

```
PokedexIsNowPersonal/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD
├── pokedex-frontend/               # React app (Vite)
│   ├── public/
│   │   ├── logo.png
│   │   ├── layer_bg.webp           # Parallax background layer
│   │   ├── layer_mid.webp          # Parallax midground layer
│   │   ├── layer_fg.webp           # Parallax foreground layer
│   │   └── staticwebapp.config.json# Azure SPA routing config
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Responsive navbar + mobile sidebar
│   │   │   ├── Footer.jsx          # Footer with version + disclaimer
│   │   │   ├── PokemonCard.jsx     # Pokédex grid card
│   │   │   └── PageHeader.jsx      # Reusable page hero header
│   │   ├── pages/
│   │   │   ├── SearchPage.jsx      # Live search hero page
│   │   │   ├── PokedexPage.jsx     # Full Pokédex grid with live search
│   │   │   ├── PokemonDetailPage.jsx # Pokédex device detail view
│   │   │   ├── AbilitiesPage.jsx   # Abilities browser
│   │   │   ├── TypesPage.jsx       # Types browser
│   │   │   ├── RegionsPage.jsx     # Regions overview
│   │   │   ├── RegionDetailPage.jsx# Region detail (routes, trainers, aces)
│   │   │   ├── RouteDetailPage.jsx # Route encounter data
│   │   │   └── RarityPage.jsx      # Legendary/Mythical/Ultra/Paradox
│   │   ├── services/
│   │   │   └── pokemonService.js   # All PokéAPI calls
│   │   ├── data/
│   │   │   └── regionData.js       # Hardcoded region/trainer data
│   │   ├── utils/
│   │   │   └── typeColors.js       # Type → color mappings
│   │   ├── App.jsx                 # Routes + parallax setup
│   │   └── index.css               # Global styles + parallax layers
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── Controllers/                    # .NET API controllers
├── Services/                       # .NET service layer
├── Models/                         # .NET data models
├── DTOs/                           # .NET data transfer objects
├── Interfaces/                     # .NET service interfaces
├── PokeDex2.0.csproj
├── azure-pipelines-frontend.yml    # Azure DevOps pipeline (optional)
└── azure-pipelines-backend.yml     # Azure DevOps pipeline (optional)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- [.NET 8 SDK](https://dotnet.microsoft.com/download) (for backend)
- [Git](https://git-scm.com)

---

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/JoseThresh98/PokedexIsNowPersonal.git
cd PokedexIsNowPersonal

# 2. Navigate to the frontend folder
cd pokedex-frontend

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Backend Setup (Optional)

The backend is a .NET 8 Web API. It is not required for the frontend to run since all data is fetched from PokéAPI directly.

```bash
# From the repo root
dotnet restore
dotnet run
```

Swagger UI will be available at `https://localhost:7266/swagger`.

---

### Build for Production

```bash
cd pokedex-frontend
npm run build
```

The built files will be in `pokedex-frontend/dist/`.

---

## 🔄 CI/CD Pipeline

This project uses **GitHub Actions** for automated deployments:

| Branch | Environment | Trigger |
|---|---|---|
| `main` | 🌟 Production | Push to `main` |
| `develop` | 🚧 Staging | Push to `develop` |

The workflow is defined in `.github/workflows/deploy.yml`. On every push it:
1. Installs Node.js 20
2. Runs `npm ci` and `npm run build`
3. Deploys the `dist/` folder to Azure Static Web Apps

---

## 🌿 Branch Strategy

```
main       ← stable production code
  └── develop  ← active development
        └── feature/xxx  ← individual features
```

Always branch off `develop` for new features and open a PR back into `develop`. Merge `develop` → `main` for production releases.

---

## 📡 API Reference

All data is sourced from [PokéAPI](https://pokeapi.co). No API key required.

| Endpoint | Used For |
|---|---|
| `/api/v2/pokemon` | Pokédex list |
| `/api/v2/pokemon/{name}` | Pokémon detail, stats, abilities |
| `/api/v2/pokemon-species/{name}` | Evolution chain URL |
| `/api/v2/evolution-chain/{id}` | Full evolution chain |
| `/api/v2/ability` | Abilities list |
| `/api/v2/ability/{name}` | Ability detail |
| `/api/v2/type` | Types list |
| `/api/v2/type/{name}` | Type detail + damage relations |
| `/api/v2/region` | Regions list |
| `/api/v2/region/{name}` | Region detail |

---

## 📸 Screenshots

| Search | Pokédex | Detail |
|---|---|---|
| Live search with parallax | 1302+ Pokémon grid | Pokédex device UI with shiny toggle |

---

## ⚠️ Disclaimer

This is a **fan-made project created for educational purposes only**.

Pokémon and all related names, characters, and trademarks are the property of **Nintendo**, **Game Freak**, and **The Pokémon Company**. This project is not affiliated with, endorsed by, or connected to any of these companies.

All Pokémon data is provided by [PokéAPI](https://pokeapi.co) — a free, open RESTful API.

---

## 👤 Author

**Jose Thresh** — [@JoseThresh98](https://github.com/JoseThresh98)

---

*Pokédex 2.0 — v2.0.0*
