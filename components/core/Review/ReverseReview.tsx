'use client';

import { useState, useEffect } from 'react';

interface Card {
  ID: number;
  Card_Set_ID: number;
  Card_Front: string;
  Card_Back: string;
}

interface ReverseReviewProps {
  cards: Card[];
  cardSetName: string;
  onExit: () => void;
  randomize?: boolean;
}

const ReverseReview = ({ cards, cardSetName, onExit, randomize = false }: ReverseReviewProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isManualFlip, setIsManualFlip] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'none' | 'left' | 'right'>('none');
  const [reviewCards, setReviewCards] = useState<Card[]>([]);

  // Initialize cards, potentially randomizing them
  useEffect(() => {
    if (randomize) {
      // Create a shuffled copy of the cards array
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setReviewCards(shuffled);
    } else {
      setReviewCards([...cards]);
    }
  }, [cards, randomize]);

  const flipCard = () => {
    setIsManualFlip(true);
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentCardIndex < reviewCards.length - 1) {
      setIsManualFlip(false);
      setIsFlipped(false);
      setSlideDirection('left');

      // After animation completes, change to the next card
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
        // Reset slide direction after a brief delay to allow the new card to appear
        setTimeout(() => {
          setSlideDirection('none');
        }, 20);
      }, 150); // Much faster animation duration
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setIsManualFlip(false);
      setIsFlipped(false);
      setSlideDirection('right');

      // After animation completes, change to the previous card
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex - 1);
        // Reset slide direction after a brief delay to allow the new card to appear
        setTimeout(() => {
          setSlideDirection('none');
        }, 20);
      }, 150); // Much faster animation duration
    }
  };

  // Wait for cards to be initialized
  if (reviewCards.length === 0) {
    return <div className="bg-white rounded-lg shadow p-6">Loading...</div>;
  }

  const currentCard = reviewCards[currentCardIndex];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{cardSetName}</h1>
        <button
          onClick={onExit}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 cursor-pointer"
        >
          Exit Review
        </button>
      </div>

      <div className="text-center mb-4">
        <p className="text-gray-600">
          Card {currentCardIndex + 1} of {reviewCards.length} (Reverse Mode)
          {randomize && ' • Randomized'}
        </p>
      </div>

      <div className="w-full mb-6 overflow-hidden" style={{ perspective: '1000px' }}>
        <div
          onClick={flipCard}
          className="relative w-full h-[300px] cursor-pointer"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
            transition: isManualFlip ? 'transform 0.3s' : 'none',
            animation:
              slideDirection === 'left'
                ? 'slideOutLeft 0.15s forwards'
                : slideDirection === 'right'
                  ? 'slideOutRight 0.15s forwards'
                  : 'none',
          }}
        >
          {/* Front of card (showing the back content) */}
          <div
            className="absolute w-full h-full rounded-lg p-8 shadow-md flex items-center justify-center bg-white border"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-xl font-medium text-center">{currentCard.Card_Back}</div>
          </div>

          {/* Back of card (showing the front content) */}
          <div
            className="absolute w-full h-full rounded-lg p-8 shadow-md flex items-center justify-center bg-white border"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }}
          >
            <div className="text-xl font-medium text-center">{currentCard.Card_Front}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevCard}
          disabled={currentCardIndex === 0 || slideDirection !== 'none'}
          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          Previous
        </button>
        <button
          onClick={nextCard}
          disabled={currentCardIndex === reviewCards.length - 1 || slideDirection !== 'none'}
          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReverseReview;
