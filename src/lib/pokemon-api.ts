import {
  Pokemon,
  PokemonListResponse,
  PokemonListItem,
  ApiError,
} from '@/types';

const handleNetworkError = (error: unknown): ApiError => {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: '네트워크 연결을 확인해주세요',
      code: 'NETWORK_ERROR',
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    message: '알 수 없는 오류가 발생했습니다',
    code: 'UNKNOWN_ERROR',
  };
};

const getErrorMessage = (status: number, errorType: string): string => {
  switch (status) {
    case 400:
      return '잘못된 요청입니다';
    case 404:
      return errorType === 'pokemon'
        ? '포켓몬을 찾을 수 없습니다'
        : '요청한 정보를 찾을 수 없습니다';
    case 429:
      return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요';
    case 500:
      return '서버에서 오류가 발생했습니다';
    case 503:
      return '서비스를 일시적으로 사용할 수 없습니다';
    default:
      return '알 수 없는 오류가 발생했습니다';
  }
};

const validateResponse = async (
  response: Response,
  errorType: string = 'api'
): Promise<void> => {
  if (!response.ok) {
    const errorMessage = getErrorMessage(response.status, errorType);
    throw new Error(errorMessage);
  }
};

const fetchWithTimeout = async (
  url: string,
  timeout = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다');
    }
    throw error;
  }
};

export async function getPokemonList(
  offset = 0,
  limit = 20
): Promise<{
  pokemonList: PokemonListItem[];
  hasNextPage: boolean;
  nextOffset: number;
}> {
  try {
    const response = await fetchWithTimeout(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    await validateResponse(response);

    const data: PokemonListResponse = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('포켓몬 목록 데이터 형식이 올바르지 않습니다');
    }

    // 포켓몬 목록에 기본 정보와 이미지 추가
    const pokemonDetails = await Promise.all(
      data.results.map(
        async (pokemon: { name: string; url: string }, index: number) => {
          const id = offset + index + 1;
          return fetchPokemonDetail(pokemon, id);
        }
      )
    );

    return {
      pokemonList: pokemonDetails,
      hasNextPage: !!data.next,
      nextOffset: offset + limit,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw {
        message: error.message,
        code: 'API_ERROR',
      } as ApiError;
    }
    throw handleNetworkError(error);
  }
}

const fetchPokemonDetail = async (
  pokemon: { name: string; url: string },
  id: number
): Promise<PokemonListItem> => {
  try {
    const pokemonDetail = await getPokemon(id.toString());
    return {
      name: pokemon.name,
      url: pokemon.url,
      id,
      image: pokemonDetail.sprites.front_default || '',
      types: pokemonDetail.types.map(
        (type: { type: { name: string } }) => type.type.name
      ),
    };
  } catch (error) {
    // 에러 발생 시 기본값 사용
    console.log(error);
    return {
      name: pokemon.name,
      url: pokemon.url,
      id,
      image: '',
      types: [],
    };
  }
};

export async function getPokemon(id: string): Promise<Pokemon> {
  try {
    if (!id || id.trim() === '') {
      throw new Error('포켓몬 ID가 필요합니다');
    }

    const numericId = parseInt(id);
    if (!isNaN(numericId) && numericId < 1) {
      throw new Error('유효하지 않은 포켓몬 ID입니다');
    }

    const response = await fetchWithTimeout(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    );
    await validateResponse(response, 'pokemon');

    const data: Pokemon = await response.json();

    // 포켓몬 상세 정보 검증 및 정리
    const pokemon: Pokemon = {
      id: data.id,
      name: data.name,
      height: data.height || 0,
      weight: data.weight || 0,
      types: data.types || [],
      stats: data.stats || [],
      abilities: data.abilities || [],
      sprites: {
        front_default: data.sprites?.front_default || '',
        other: data.sprites?.other || undefined,
      },
    };

    return pokemon;
  } catch (error) {
    if (error instanceof Error) {
      throw {
        message: error.message,
        code: 'API_ERROR',
      } as ApiError;
    }
    throw handleNetworkError(error);
  }
}
