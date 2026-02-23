namespace PokeDex2._0.Models
{
    public class PokemonListResponse
    {
        public int Count { get; set; }
        public string? Next { get; set; }
        public string? Previous { get; set; }
        public List<PokemonListItem> Results { get; set; } = new();
    }
}
