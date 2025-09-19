'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPokemonList } from '@/lib/pokemon-api';
import { PokemonListItem } from '@/types';
import { Toast } from '../ui/toast';

export const PokemonList: React.FC<{
  defaultPokemonList: {
    pokemonList: PokemonListItem[];
    hasNextPage: boolean;
    nextOffset: number;
  };
}> = ({ defaultPokemonList }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const allPokemon = data?.pages.flatMap(page => page.pokemonList) || [];

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold mb-6'>포켓몬 목록</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {allPokemon.map((pokemon, index) => {
          const isLastPokemon = index === allPokemon.length - 1;

          return (
            <div
              key={pokemon.id}
              ref={isLastPokemon ? lastPokemonElementRef : null}
              className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow'
            >
              {/* 포켓몬 이미지 */}
              <div className='bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex justify-center'>
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  width={120}
                  height={120}
                  className='object-contain'
                />
              </div>

              {/* 포켓몬 정보 */}
              <div className='p-4'>
                <div className='text-center mb-3'>
                  <div className='text-sm text-gray-500 mb-1'>
                    #{pokemon.id}
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 capitalize'>
                    {pokemon.name}
                  </h3>
                </div>

                {/* 타입 */}
                <div className='flex flex-wrap gap-2 justify-center mb-4'>
                  {pokemon.types.map((type, typeIndex) => (
                    <span
                      key={typeIndex}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        type === 'grass'
                          ? 'bg-green-100 text-green-800'
                          : type === 'fire'
                            ? 'bg-red-100 text-red-800'
                            : type === 'water'
                              ? 'bg-blue-100 text-blue-800'
                              : type === 'electric'
                                ? 'bg-yellow-100 text-yellow-800'
                                : type === 'poison'
                                  ? 'bg-purple-100 text-purple-800'
                                  : type === 'flying'
                                    ? 'bg-sky-100 text-sky-800'
                                    : type === 'ground'
                                      ? 'bg-amber-100 text-amber-800'
                                      : type === 'psychic'
                                        ? 'bg-pink-100 text-pink-800'
                                        : type === 'bug'
                                          ? 'bg-lime-100 text-lime-800'
                                          : type === 'rock'
                                            ? 'bg-stone-100 text-stone-800'
                                            : type === 'ghost'
                                              ? 'bg-indigo-100 text-indigo-800'
                                              : type === 'dragon'
                                                ? 'bg-violet-100 text-violet-800'
                                                : type === 'dark'
                                                  ? 'bg-gray-100 text-gray-800'
                                                  : type === 'steel'
                                                    ? 'bg-slate-100 text-slate-800'
                                                    : type === 'fairy'
                                                      ? 'bg-rose-100 text-rose-800'
                                                      : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>

                {/* 액션 버튼 */}
                <div className='flex gap-2'>
                  <button className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'>
                    상세보기
                  </button>
                  <button className='flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium'>
                    수집하기
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 로딩 인디케이터 */}
      {isFetchingNextPage && (
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='ml-2 text-gray-600'>
            더 많은 포켓몬을 불러오는 중...
          </span>
        </div>
      )}

      {/* 토스트 메시지 */}
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
