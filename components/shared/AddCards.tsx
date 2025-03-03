'use client';

import { useState } from 'react';
import { createCard, createCards } from '@/lib/actions/cards.actions';

interface AddCardsProps {
  cardSetId: number;
  onCardAdded?: () => void;
}

const AddCards = ({ cardSetId, onCardAdded }: AddCardsProps) => {
  const [cards, setCards] = useState([{ front: '', back: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCardChange = (index: number, field: 'front' | 'back', value: string) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const addCardField = () => {
    setCards([...cards, { front: '', back: '' }]);
  };

  const removeCardField = (index: number) => {
    if (cards.length > 1) {
      const updatedCards = [...cards];
      updatedCards.splice(index, 1);
      setCards(updatedCards);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all cards
    const invalidCards = cards.filter((card) => !card.front.trim() || !card.back.trim());
    if (invalidCards.length > 0) {
      setError('All cards must have both front and back content');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Create all cards sequentially
      const cardsToCreate = cards.map((card) => ({
        Card_Set_ID: cardSetId,
        Card_Front: card.front,
        Card_Back: card.back,
      }));
      await createCards(cardsToCreate);
      // Clear form after successful submission
      setCards([{ front: '', back: '' }]);
      setSuccessMessage(`Successfully added ${cards.length} card${cards.length > 1 ? 's' : ''}`);

      // Notify parent component if callback provided
      if (onCardAdded) {
        onCardAdded();
      }
    } catch (err) {
      setError('Failed to add cards. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Cards</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {cards.map((card, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Card {index + 1}</h3>
              {cards.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCardField(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor={`cardFront-${index}`}
                className="block text-gray-700 font-medium mb-2"
              >
                Front
              </label>
              <textarea
                id={`cardFront-${index}`}
                value={card.front}
                onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter the front content of your card"
              />
            </div>

            <div className="mb-2">
              <label htmlFor={`cardBack-${index}`} className="block text-gray-700 font-medium mb-2">
                Back
              </label>
              <textarea
                id={`cardBack-${index}`}
                value={card.back}
                onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter the back content of your card"
              />
            </div>
          </div>
        ))}

        <div className="mb-6">
          <button
            type="button"
            onClick={addCardField}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            + Add Another Card
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Adding...' : `Add ${cards.length} Card${cards.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCards;
