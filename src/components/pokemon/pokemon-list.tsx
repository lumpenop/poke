'use client';

import React, { useState } from 'react';

import { PokemonListItem } from '@/types';
import { Toast } from '../ui/toast';

export const PokemonList: React.FC<{
  defaultPokemonList: PokemonListItem[];
}> = ({ defaultPokemonList }) => {
  const [pokemonList, setPokemonList] =
    useState<PokemonListItem[]>(defaultPokemonList);

  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (error) {
    return (
      <div className='min-h-64 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            포켓몬 목록을 불러올 수 없습니다
          </h3>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setPokemonList(defaultPokemonList);
            }}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold mb-6'>포켓몬 목록</h2>

      <ul className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {pokemonList.map(pokemon => (
          <li key={pokemon.id}>
            <span>{pokemon.name}</span>
          </li>
        ))}
      </ul>

      {/* 토스트 메시지 */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={error ? 'error' : 'success'}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};
