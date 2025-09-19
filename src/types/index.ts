export * from './translation';

// API 에러 타입 정의
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// 포켓몬 API 응답 타입
export interface PokemonListResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
  count: number;
  next?: string;
  previous?: string;
}

// 포켓몬 목록 아이템 타입 (확장된 정보 포함)
export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
  image: string;
  types: string[];
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
}
