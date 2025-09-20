'use client';

import React from 'react';
import Image from 'next/image';
import { usePokemonStore } from '@/stores/pokemon-store';

export const CollectedPokemon: React.FC = () => {
  const { pokemons, removePokemon, clearPokemons } = usePokemonStore();

  if (pokemons.length === 0) {
    return (
      <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>📦</div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            수집된 포켓몬이 없습니다
          </h3>
          <p className='text-gray-600'>포켓몬을 수집해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          수집된 포켓몬 ({pokemons.length}마리)
        </h3>
        <button
          onClick={clearPokemons}
          className='px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors'
        >
          전체 삭제
        </button>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'>
        {pokemons.map(pokemon => (
          <div
            key={pokemon.id}
            className='bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow group'
          >
            <div className='aspect-square bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg mb-2 flex items-center justify-center'>
              {pokemon.image ? (
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  width={60}
                  height={60}
                  className='object-contain'
                />
              ) : (
                <div className='text-gray-400 text-2xl'>❓</div>
              )}
            </div>

            <div className='text-center'>
              <div className='text-xs text-gray-500 mb-1'>#{pokemon.id}</div>
              <div className='text-sm font-medium text-gray-900 truncate'>
                {pokemon.name}
              </div>
            </div>

            <button
              onClick={() => removePokemon(pokemon.id)}
              className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-all'
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
