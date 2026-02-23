using PokeDex2._0.DTOs;

namespace PokeDex2._0.Interfaces
{
    public interface IPokemonService
    {
        Task<PagedResultDto<PokemonSummaryDto>> GetPokemonListAsync(int page, int pageSize);
        Task<PokemonDetailDto?> GetPokemonByNameOrIdAsync(string nameOrId);
    }
}