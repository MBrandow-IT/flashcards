'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCards } from '@/lib/actions/cards.actions';
import AddCards from '../shared/AddCards';
import Review from './Review/Review';
import ReverseReview from './Review/ReverseReview';
import EditCardModal from '../shared/EditCardModal';

interface Card {
  ID: number;
  Card_Set_ID: number;
  Card_Front: string;
  Card_Back: string;
}

interface CardSetDisplayProps {
  cardSetName: string;
  cards: Card[];
  cardSetId: number;
}

const CardSetDisplay = ({ cardSetName, cards, cardSetId }: CardSetDisplayProps) => {
  const [reviewMode, setReviewMode] = useState<'none' | 'normal' | 'reverse'>('none');
  const [localCards, setLocalCards] = useState<Card[]>(cards);
  const [showAddCards, setShowAddCards] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [randomReview, setRandomReview] = useState(false);

  const handleCardAdded = async () => {
    // Fetch updated cards after adding a new one
    try {
      const updatedCards = await getCards(cardSetId);
      setLocalCards(updatedCards);
    } catch (error) {
      console.error('Failed to refresh cards:', error);
    }
  };

  const exitReview = () => {
    setReviewMode('none');
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
  };

  const handleCloseEditModal = () => {
    setEditingCard(null);
  };

  if (localCards.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{cardSetName}</h1>
          <Link href="/" className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300">
            Back to Sets
          </Link>
        </div>
        <p className="text-center text-gray-500 my-8">No cards in this set yet.</p>
        <div className="mt-6">
          <AddCards cardSetId={cardSetId} onCardAdded={handleCardAdded} />
        </div>
      </div>
    );
  }

  if (reviewMode === 'normal') {
    return (
      <Review
        cards={localCards}
        cardSetName={cardSetName}
        onExit={exitReview}
        randomize={randomReview}
      />
    );
  }

  if (reviewMode === 'reverse') {
    return (
      <ReverseReview
        cards={localCards}
        cardSetName={cardSetName}
        onExit={exitReview}
        randomize={randomReview}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">{cardSetName}</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <Link
              href="/"
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 w-full sm:w-auto text-center flex items-center justify-center"
            >
              Back to Sets
            </Link>
            <button
              onClick={() => setShowAddCards(!showAddCards)}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded cursor-pointer hover:bg-gray-300 w-full sm:w-auto flex items-center justify-center"
            >
              {showAddCards ? 'Hide Form' : 'Edit Set'}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setReviewMode('normal')}
                className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600 w-full sm:w-auto flex items-center justify-center"
              >
                Review Cards
              </button>
              <button
                onClick={() => setReviewMode('reverse')}
                className="bg-green-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-green-600 w-full sm:w-auto flex items-center justify-center"
              >
                Reverse Review
              </button>
            </div>
            <div className="flex items-center justify-end">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={randomReview}
                  onChange={() => setRandomReview(!randomReview)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Randomize cards</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {showAddCards && (
        <div className="mb-8">
          <AddCards cardSetId={cardSetId} onCardAdded={handleCardAdded} />
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Cards in this set ({localCards.length})</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localCards.map((card) => (
          <div
            key={card.ID}
            className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition-all"
            onClick={() => handleEditCard(card)}
          >
            <div className="font-medium mb-2">Front:</div>
            <div className="p-3 bg-gray-50 rounded mb-3">{card.Card_Front}</div>
            <div className="font-medium mb-2">Back:</div>
            <div className="p-3 bg-gray-50 rounded">{card.Card_Back}</div>
          </div>
        ))}
      </div>

      {editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={handleCloseEditModal}
          onCardUpdated={handleCardAdded}
        />
      )}
    </div>
  );
};

export default CardSetDisplay;
