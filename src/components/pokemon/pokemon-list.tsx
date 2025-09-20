'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPokemonList } from '@/lib/pokemon-api';
import { PokemonListItem } from '@/types';
import { Toast } from '../ui/toast';
import { usePokemonStore } from '@/stores/pokemon-store';
import { getTypeColorClass } from '@/utils/pokemon-types';

export const PokemonList: React.FC<{
  defaultPokemonList: {
    pokemonList: PokemonListItem[];
    hasNextPage: boolean;
    nextOffset: number;
  };
}> = ({ defaultPokemonList }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 필요한 상태만 선택적으로 구독
  const searchQuery = usePokemonStore(state => state.searchQuery);
  const setSearchQuery = usePokemonStore(state => state.setSearchQuery);
  const setSelectedPokemon = usePokemonStore(state => state.setSelectedPokemon);
  const addPokemon = usePokemonStore(state => state.addPokemon);
  const setPokemons = usePokemonStore(state => state.setPokemons);
  const setLoading = usePokemonStore(state => state.setLoading);
  const setError = usePokemonStore(state => state.setError);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['pokemon-list'],
    queryFn: ({ pageParam = 0 }) => getPokemonList(pageParam, 20),
    getNextPageParam: lastPage =>
      lastPage.hasNextPage ? lastPage.nextOffset : undefined,
    initialPageParam: 0,
    initialData: {
      pages: [defaultPokemonList],
      pageParams: [0],
    },
  });

  useEffect(() => {
    if (data?.pages) {
      const allPokemon = data.pages.flatMap(page => page.pokemonList);
      setPokemons(allPokemon);
    }
  }, [data, setPokemons]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (error) {
      setError(
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다'
      );
    } else {
      setError(null);
    }
  }, [error, setError]);

  // 무한스크롤을 위한 Intersection Observer
  const lastPokemonElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetchingNextPage) return;
      if (!hasNextPage) return;

      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      });

      if (node) observer.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // 에러 토스트 표시
  useEffect(() => {
    if (error) {
      setToastMessage(
        error instanceof Error ? error.message : '포켓몬을 불러올 수 없습니다'
      );
    }
  }, [error]);

  // 메모이제이션된 값들 (early return 이전에 위치)
  const allPokemon = useMemo(
    () => data?.pages.flatMap(page => page.pokemonList) || [],
    [data]
  );

  const filteredPokemon = useMemo(() => {
    if (!searchQuery) return allPokemon;
    return allPokemon.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allPokemon, searchQuery]);

  // 버튼 클릭 핸들러들 메모이제이션
  const handlePokemonSelect = useCallback(
    (pokemon: PokemonListItem) => {
      setSelectedPokemon(pokemon);
    },
    [setSelectedPokemon]
  );

  const handlePokemonCollect = useCallback(
    (pokemon: PokemonListItem) => {
      addPokemon(pokemon);
      setToastMessage(`${pokemon.name}을(를) 수집했습니다!`);
    },
    [addPokemon]
  );

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <span className='ml-2 text-gray-600'>로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-64 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            포켓몬 목록을 불러올 수 없습니다
          </h3>
          <p className='text-gray-600 mb-4'>
            {error instanceof Error
              ? error.message
              : '알 수 없는 오류가 발생했습니다'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <h2 className='text-2xl font-bold'>포켓몬 목록</h2>

        <div className='w-full sm:w-80'>
          <input
            type='text'
            placeholder='포켓몬 이름으로 검색...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {filteredPokemon.map((pokemon, index) => {
          const isLastPokemon = index === filteredPokemon.length - 1;

          return (
            <div
              key={pokemon.id}
              ref={isLastPokemon ? lastPokemonElementRef : null}
              className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow'
            >
              <div className='bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex justify-center'>
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  width={120}
                  height={120}
                  className='object-contain'
                />
              </div>

              <div className='p-4'>
                <div className='text-center mb-3'>
                  <div className='text-sm text-gray-500 mb-1'>
                    #{pokemon.id}
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 capitalize'>
                    {pokemon.name}
                  </h3>
                </div>

                <div className='flex flex-wrap gap-2 justify-center mb-4'>
                  {pokemon.types.map((type, typeIndex) => (
                    <span
                      key={typeIndex}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColorClass(type)}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <div className='flex gap-2'>
                  <button
                    onClick={() => handlePokemonSelect(pokemon)}
                    className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
                  >
                    상세보기
                  </button>
                  <button
                    onClick={() => handlePokemonCollect(pokemon)}
                    className='flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium'
                  >
                    수집하기
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isFetchingNextPage && (
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='ml-2 text-gray-600'>
            더 많은 포켓몬을 불러오는 중...
          </span>
        </div>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type='error'
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};
