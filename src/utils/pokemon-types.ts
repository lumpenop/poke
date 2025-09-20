/**
 * 포켓몬 타입별 색상 매핑 유틸리티
 */

export type PokemonType =
  | 'grass'
  | 'fire'
  | 'water'
  | 'electric'
  | 'poison'
  | 'flying'
  | 'ground'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'
  | 'normal'
  | 'ice'
  | 'fighting';

interface TypeColorConfig {
  bg: string;
  text: string;
}

const TYPE_COLORS: Record<PokemonType, TypeColorConfig> = {
  grass: { bg: 'bg-green-100', text: 'text-green-800' },
  fire: { bg: 'bg-red-100', text: 'text-red-800' },
  water: { bg: 'bg-blue-100', text: 'text-blue-800' },
  electric: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  poison: { bg: 'bg-purple-100', text: 'text-purple-800' },
  flying: { bg: 'bg-sky-100', text: 'text-sky-800' },
  ground: { bg: 'bg-amber-100', text: 'text-amber-800' },
  psychic: { bg: 'bg-pink-100', text: 'text-pink-800' },
  bug: { bg: 'bg-lime-100', text: 'text-lime-800' },
  rock: { bg: 'bg-stone-100', text: 'text-stone-800' },
  ghost: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  dragon: { bg: 'bg-violet-100', text: 'text-violet-800' },
  dark: { bg: 'bg-gray-100', text: 'text-gray-800' },
  steel: { bg: 'bg-slate-100', text: 'text-slate-800' },
  fairy: { bg: 'bg-rose-100', text: 'text-rose-800' },
  normal: { bg: 'bg-gray-100', text: 'text-gray-800' },
  ice: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
  fighting: { bg: 'bg-orange-100', text: 'text-orange-800' },
};

/**
 * 포켓몬 타입에 따른 Tailwind CSS 클래스를 반환합니다.
 * @param type 포켓몬 타입
 * @returns 배경색과 텍스트 색상 클래스 문자열
 */
export function getTypeColorClass(type: string): string {
  const normalizedType = type.toLowerCase() as PokemonType;
  const colorConfig = TYPE_COLORS[normalizedType] || TYPE_COLORS.normal;

  return `${colorConfig.bg} ${colorConfig.text}`;
}

/**
 * 포켓몬 타입이 유효한지 확인합니다.
 * @param type 확인할 타입
 * @returns 유효한 타입인지 여부
 */
export function isValidPokemonType(type: string): type is PokemonType {
  return type.toLowerCase() in TYPE_COLORS;
}

/**
 * 모든 포켓몬 타입 목록을 반환합니다.
 * @returns 포켓몬 타입 배열
 */
export function getAllPokemonTypes(): PokemonType[] {
  return Object.keys(TYPE_COLORS) as PokemonType[];
}
