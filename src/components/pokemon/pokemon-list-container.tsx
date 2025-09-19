import { getPokemonList } from '@/lib/pokemon-api';
import { ErrorBoundary } from '../error-boundary';
import { PokemonList } from './pokemon-list';

export async function PokemonListContainer() {
  const pokemonList = await getPokemonList();

  return (
    <ErrorBoundary>
      <PokemonList defaultPokemonList={pokemonList} />
    </ErrorBoundary>
  );
}
