export interface Source {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export const sources: Source[] = [
  { id: "18plus", name: "18+", slug: "18plus", category: "Adult" },
  { id: "anime", name: "Anime", slug: "anime", category: "Anime" },
  { id: "bilitv", name: "BiliTV", slug: "bilitv", category: "Drama" },
  { id: "cashdrama", name: "CashDrama", slug: "cashdrama", category: "Drama" },
  { id: "cubetv", name: "CubeTV", slug: "cubetv", category: "Drama" },
  { id: "dotdrama", name: "DotDrama", slug: "dotdrama", category: "Drama" },
  { id: "drama-korea", name: "Drama Korea", slug: "drama-korea", category: "K-Drama" },
  { id: "dramabite", name: "DramaBite", slug: "dramabite", category: "Drama" },
  { id: "dramabox", name: "DramaBox", slug: "dramabox", category: "Drama" },
  { id: "dramaboxv4", name: "DramaBox V4", slug: "dramaboxv4", category: "Drama" },
  { id: "dramadash", name: "DramaDash", slug: "dramadash", category: "Drama" },
  { id: "dramanova", name: "DramaNova", slug: "dramanova", category: "Drama" },
  { id: "dramanow", name: "DramaNow", slug: "dramanow", category: "Drama" },
  { id: "dramapops", name: "DramaPops", slug: "dramapops", category: "Drama" },
  { id: "dramarush", name: "DramaRush", slug: "dramarush", category: "Drama" },
  { id: "dramawave", name: "DramaWave", slug: "dramawave", category: "Drama" },
  { id: "flextv", name: "FlexTV", slug: "flextv", category: "Short" },
  { id: "flickreels", name: "FlickReels", slug: "flickreels", category: "Short" },
  { id: "flickshort", name: "FlickShort", slug: "flickshort", category: "Short" },
  { id: "freereels", name: "FreeReels", slug: "freereels", category: "Short" },
  { id: "fundrama", name: "FunDrama", slug: "fundrama", category: "Drama" },
  { id: "goodshort", name: "GoodShort", slug: "goodshort", category: "Short" },
  { id: "hishort", name: "HiShort", slug: "hishort", category: "Short" },
  { id: "idrama", name: "iDrama", slug: "idrama", category: "Drama" },
  { id: "komiku", name: "Komiku", slug: "komiku", category: "Manga" },
  { id: "manhwaread", name: "ManhwaRead", slug: "manhwaread", category: "Manga" },
  { id: "melolo", name: "Melolo", slug: "melolo", category: "Short" },
  { id: "meloshort", name: "MeloShort", slug: "meloshort", category: "Short" },
  { id: "microdrama", name: "MicroDrama", slug: "microdrama", category: "Short" },
  { id: "minutedrama", name: "MinuteDrama", slug: "minutedrama", category: "Short" },
  { id: "moboreels", name: "MoboReels", slug: "moboreels", category: "Short" },
  { id: "movie", name: "Movie", slug: "movie", category: "Movie" },
  { id: "netshort", name: "NetShort", slug: "netshort", category: "Short" },
  { id: "pinedrama", name: "PineDrama", slug: "pinedrama", category: "Drama" },
  { id: "radreels", name: "RadReels", slug: "radreels", category: "Short" },
  { id: "rapidtv", name: "RapidTV", slug: "rapidtv", category: "Drama" },
  { id: "reelala", name: "Reelala", slug: "reelala", category: "Short" },
  { id: "reelife", name: "Reelife", slug: "reelife", category: "Short" },
  { id: "reelshort", name: "ReelShort", slug: "reelshort", category: "Short" },
  { id: "sarostv", name: "SarosTV", slug: "sarostv", category: "Drama" },
  { id: "sereal", name: "Sereal", slug: "sereal", category: "Drama" },
  { id: "shortbox", name: "ShortBox", slug: "shortbox", category: "Short" },
  { id: "shorten", name: "Shorten", slug: "shorten", category: "Short" },
  { id: "shortmax", name: "ShortMax", slug: "shortmax", category: "Short" },
  { id: "shortsky", name: "ShortSky", slug: "shortsky", category: "Short" },
  { id: "shortwave", name: "ShortWave", slug: "shortwave", category: "Short" },
  { id: "shotshort", name: "ShotShort", slug: "shotshort", category: "Short" },
  { id: "snackshort", name: "SnackShort", slug: "snackshort", category: "Short" },
  { id: "sodareels", name: "SodaReels", slug: "sodareels", category: "Short" },
  { id: "stardusttv", name: "StardustTV", slug: "stardusttv", category: "Drama" },
  { id: "starshort", name: "StarShort", slug: "starshort", category: "Short" },
  { id: "velolo", name: "Velolo", slug: "velolo", category: "Short" },
  { id: "vigloo", name: "Vigloo", slug: "vigloo", category: "Short" },
];

export const sourceCategories = [...new Set(sources.map((s) => s.category))];

export function getSourcesByCategory(category: string): Source[] {
  return sources.filter((s) => s.category === category);
}

export function getSourceById(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}
