using Microsoft.AspNetCore.Mvc;
using PokeDex2._0.Interfaces;
using System.Diagnostics;

namespace PokeDex2._0.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PokemonController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;

        public PokemonController(IPokemonService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        // GET api/pokemon?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetPokemonList(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            if (page < 1 || pageSize < 1 || pageSize > 100)
                return BadRequest("Invalid pagination parameters.");

            var result = await _pokemonService.GetPokemonListAsync(page, pageSize);
            return Ok(result);
        }

        // GET api/pokemon/pikachu  OR  api/pokemon/25
        [HttpGet("{nameOrId}")]
        public async Task<IActionResult> GetPokemon(string nameOrId)
        {
            if (string.IsNullOrWhiteSpace(nameOrId))
                return BadRequest("Name or ID is required.");

            var result = await _pokemonService.GetPokemonByNameOrIdAsync(nameOrId);

            if (result == null)
                return NotFound($"Pokemon '{nameOrId}' not found.");

            return Ok(result);
        }
    }
}