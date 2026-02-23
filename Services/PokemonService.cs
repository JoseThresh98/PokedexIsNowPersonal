using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using PokeDex2._0.DTOs;
using PokeDex2._0.Interfaces;
using PokeDex2._0.Models;

namespace PokeDex2._0.Services
{
    public class PokemonService : IPokemonService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public PokemonService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<PagedResultDto<PokemonSummaryDto>> GetPokemonListAsync(int page, int pageSize)
        {
            var client = _httpClientFactory.CreateClient("PokeAPI");
            int offset = (page - 1) * pageSize;

            var response = await client.GetAsync($"pokemon?limit={pageSize}&offset={offset}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var settings = new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver { NamingStrategy = new SnakeCaseNamingStrategy() }
            };

            var listResponse = JsonConvert.DeserializeObject<PokemonListResponse>(json, settings)!;

            // Fetch details for each pokemon in parallel to get images and types
            var detailTasks = listResponse.Results.Select(p => GetPokemonByNameOrIdAsync(p.Name));
            var details = await Task.WhenAll(detailTasks);

            var results = details
                .Where(d => d != null)
                .Select(d => new PokemonSummaryDto
                {
                    Id = d!.Id,
                    Name = d.Name,
                    ImageUrl = d.ImageUrl,
                    Types = d.Types
                }).ToList();

            return new PagedResultDto<PokemonSummaryDto>
            {
                TotalCount = listResponse.Count,
                Page = page,
                PageSize = pageSize,
                Results = results
            };
        }

        public async Task<PokemonDetailDto?> GetPokemonByNameOrIdAsync(string nameOrId)
        {
            var client = _httpClientFactory.CreateClient("PokeAPI");
            var response = await client.GetAsync($"pokemon/{nameOrId.ToLower()}");

            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var settings = new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver { NamingStrategy = new SnakeCaseNamingStrategy() }
            };

            var detail = JsonConvert.DeserializeObject<PokemonDetail>(json, settings)!;

            return new PokemonDetailDto
            {
                Id = detail.Id,
                Name = detail.Name,
                Height = detail.Height,
                Weight = detail.Weight,
                BaseExperience = detail.BaseExperience,
                ImageUrl = detail.Sprites?.Other?.OfficialArtworkImages?.FrontDefault
                           ?? detail.Sprites?.FrontDefault
                           ?? string.Empty,
                ShinyImageUrl = detail.Sprites?.Other?.OfficialArtworkImages?.FrontShiny
                                ?? detail.Sprites?.FrontShiny
                                ?? string.Empty,
                Types = detail.Types.Select(t => t.Type.Name).ToList(),
                Abilities = detail.Abilities.Select(a => new AbilityDto
                {
                    Name = a.Ability.Name,
                    IsHidden = a.IsHidden
                }).ToList(),
                Stats = detail.Stats.Select(s => new StatDto
                {
                    Name = s.Stat.Name,
                    Value = s.BaseStat
                }).ToList()
            };
        }
    }
}