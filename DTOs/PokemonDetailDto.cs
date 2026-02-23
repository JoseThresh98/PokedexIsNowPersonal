namespace PokeDex2._0.DTOs
{
    public class PokemonDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Height { get; set; }
        public int Weight { get; set; }
        public int BaseExperience { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string ShinyImageUrl { get; set; } = string.Empty;
        public List<string> Types { get; set; } = new();
        public List<AbilityDto> Abilities { get; set; } = new();
        public List<StatDto> Stats { get; set; } = new();
    }

    public class AbilityDto
    {
        public string Name { get; set; } = string.Empty;
        public bool IsHidden { get; set; }
    }

    public class StatDto
    {
        public string Name { get; set; } = string.Empty;
        public int Value { get; set; }
    }
}