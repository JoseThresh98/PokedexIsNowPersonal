namespace PokeDex2._0.Models
{
    public class PokemonDetail
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int BaseExperience { get; set; }
        public int Height { get; set; }
        public int Weight { get; set; }
        public List<PokemonTypeSlot> Types { get; set; } = new();
        public List<PokemonStatSlot> Stats { get; set; } = new();
        public List<PokemonAbilitySlot> Abilities { get; set; } = new();
        public PokemonSprites Sprites { get; set; } = new();
    }

    public class PokemonTypeSlot
    {
        public int Slot { get; set; }
        public PokemonType Type { get; set; } = new();
    }

    public class PokemonType
    {
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public class PokemonStatSlot
    {
        public int BaseStat { get; set; }
        public int Effort { get; set; }
        public PokemonStat Stat { get; set; } = new();
    }

    public class PokemonStat
    {
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public class PokemonAbilitySlot
    {
        public bool IsHidden { get; set; }
        public int Slot { get; set; }
        public PokemonAbility Ability { get; set; } = new();
    }

    public class PokemonAbility
    {
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public class PokemonSprites
    {
        public string? FrontDefault { get; set; }
        public string? FrontShiny { get; set; }
        public OfficialArtwork? Other { get; set; }
    }

    public class OfficialArtwork
    {
        public ArtworkImages? OfficialArtworkImages { get; set; }
    }

    public class ArtworkImages
    {
        public string? FrontDefault { get; set; }
        public string? FrontShiny { get; set; }
    }
}