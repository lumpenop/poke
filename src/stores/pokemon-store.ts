import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Pokemon {
  id: number;
  name: string;
  url: string;
  image?: string;
  types?: string[];
  height?: number;
  weight?: number;
}

interface PokemonState {
  pokemons: Pokemon[];
  selectedPokemon: Pokemon | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

interface PokemonActions {
  setPokemons: (pokemons: Pokemon[]) => void;
  setSelectedPokemon: (pokemon: Pokemon | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  addPokemon: (pokemon: Pokemon) => void;
  updatePokemon: (id: number, updates: Partial<Pokemon>) => void;
  removePokemon: (id: number) => void;
  clearPokemons: () => void;
  reset: () => void;
}

const initialState: PokemonState = {
  pokemons: [],
  selectedPokemon: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 20,
};

export const usePokemonStore = create<PokemonState & PokemonActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setPokemons: pokemons => set({ pokemons }, false, 'setPokemons'),

      setSelectedPokemon: pokemon =>
        set({ selectedPokemon: pokemon }, false, 'setSelectedPokemon'),

      setLoading: isLoading => set({ isLoading }, false, 'setLoading'),

      setError: error => set({ error }, false, 'setError'),

      setSearchQuery: searchQuery =>
        set({ searchQuery }, false, 'setSearchQuery'),

      setCurrentPage: currentPage =>
        set({ currentPage }, false, 'setCurrentPage'),

      setTotalPages: totalPages => set({ totalPages }, false, 'setTotalPages'),

      addPokemon: pokemon =>
        set(
          state => ({
            pokemons: [...state.pokemons, pokemon],
          }),
          false,
          'addPokemon'
        ),

      updatePokemon: (id, updates) =>
        set(
          state => ({
            pokemons: state.pokemons.map(pokemon =>
              pokemon.id === id ? { ...pokemon, ...updates } : pokemon
            ),
          }),
          false,
          'updatePokemon'
        ),

      removePokemon: id =>
        set(
          state => ({
            pokemons: state.pokemons.filter(pokemon => pokemon.id !== id),
          }),
          false,
          'removePokemon'
        ),

      clearPokemons: () => set({ pokemons: [] }, false, 'clearPokemons'),

      reset: () => set(initialState, false, 'reset'),
    }),
    {
      name: 'pokemon-store',
    }
  )
);

// 선택자 함수들 (성능 최적화를 위한 메모이제이션)
export const pokemonSelectors = {
  getFilteredPokemons: (state: PokemonState) => {
    const { pokemons, searchQuery } = state;
    if (!searchQuery) return pokemons;

    return pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },

  getPokemonById: (id: number) => (state: PokemonState) =>
    state.pokemons.find(pokemon => pokemon.id === id),

  getPaginatedPokemons: (state: PokemonState) => {
    const { pokemons, currentPage, itemsPerPage } = state;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return pokemons.slice(startIndex, endIndex);
  },
};
