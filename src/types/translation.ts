export interface CommonTranslations {
  hello: string;
  welcome: string;
  loading: string;
  error: string;
  retry: string;
  close: string;
  search: string;
  filter: string;
  sort: string;
}

export interface PokemonTypeTranslations {
  normal: string;
  fire: string;
  water: string;
  electric: string;
  grass: string;
  ice: string;
  fighting: string;
  poison: string;
  ground: string;
  flying: string;
  psychic: string;
  bug: string;
  rock: string;
  ghost: string;
  dragon: string;
  dark: string;
  steel: string;
  fairy: string;
}

export interface PokemonStatsTranslations {
  hp: string;
  attack: string;
  defense: string;
  specialAttack: string;
  specialDefense: string;
  speed: string;
}

export interface PokedexTranslations {
  title: string;
  subtitle: string;
  totalPokemon: string;
  pokemonNotFound: string;
  searchPlaceholder: string;
  types: PokemonTypeTranslations;
  stats: PokemonStatsTranslations;
  abilities: string;
  height: string;
  weight: string;
  category: string;
  generation: string;
}

export interface NavigationTranslations {
  home: string;
  pokemon: string;
  types: string;
  generations: string;
  favorites: string;
  settings: string;
}

export interface TranslationResources {
  common: CommonTranslations;
  pokedex: PokedexTranslations;
  navigation: NavigationTranslations;
}

export type SupportedLanguages = 'ko' | 'en' | 'ja';

export interface LanguageOption {
  code: SupportedLanguages;
  name: string;
}

// i18next 타입 확장
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: TranslationResources;
    };
  }
}
