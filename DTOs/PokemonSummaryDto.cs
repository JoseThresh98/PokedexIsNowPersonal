namespace PokeDex2._0.DTOs
{
    public class PokemonSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public List<string> Types { get; set; } = new();
    }
}
