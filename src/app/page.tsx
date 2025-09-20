import { PokemonListContainer } from '@/components/pokemon/pokemon-list-container';
import { CollectedPokemon } from '@/components/pokemon/collected-pokemon';

export default function Home() {
  return (
    <div className='p-4 space-y-8'>
      <PokemonListContainer />
      {/* <CollectedPokemon /> */}
    </div>
  );
}
