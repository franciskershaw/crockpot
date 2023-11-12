'use client';

import React from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import RecipeCardModal from '../RecipeCardModal/RecipeCardModal';
import './styles.scss';
import { Recipe } from '@/src/types/types';
import Modal from '../Modal/Modal';

type RecipeCardListProps = {
  recipes: Recipe[];
};

function RecipeCardList({ recipes }: RecipeCardListProps) {
  return (
    <div className='recipe-card-list'>
      {recipes.map((recipe) => (
        <Modal
          key={recipe._id}
          title={
            <div className='flex'>
              <div>{recipe.timeInMinutes} mins</div>
              {recipe.categories.map((category) => (
                <div
                  key={category._id}
                  className='ml-2 pl-2 border-l border-black'
                >
                  {category.name}
                </div>
              ))}
            </div>
          }
          isWide
          paddingOff
          trigger={
            <div className='recipe-card'>
              <RecipeCard recipe={recipe} />
            </div>
          }
        >
          <RecipeCardModal recipe={recipe} />
        </Modal>
      ))}
    </div>
  );
}

export default RecipeCardList;
