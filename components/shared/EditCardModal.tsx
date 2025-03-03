'use client';

import { useState, useEffect, useRef } from 'react';
import { updateCard, deleteCard } from '@/lib/actions/cards.actions';

interface Card {
  ID: number;
  Card_Set_ID: number;
  Card_Front: string;
  Card_Back: string;
}

interface EditCardModalProps {
  card: Card;
  onClose: () => void;
  onCardUpdated: () => void;
}

const EditCardModal = ({ card, onClose, onCardUpdated }: EditCardModalProps) => {
  const [cardFront, setCardFront] = useState(card.Card_Front);
  const [cardBack, setCardBack] = useState(card.Card_Back);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardFront.trim() || !cardBack.trim()) {
      setError('Both front and back of the card are required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateCard({
        ID: card.ID,
        Card_Front: cardFront,
        Card_Back: cardBack,
      });

      setSuccessMessage('Card updated successfully');

      // Notify parent component
      if (onCardUpdated) {
        onCardUpdated();
      }

      // Close modal after a brief delay
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError('Failed to update card. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await deleteCard(card.ID);

      setSuccessMessage('Card deleted successfully');

      // Notify parent component
      if (onCardUpdated) {
        onCardUpdated();
      }

      // Close modal after a brief delay
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError('Failed to delete card. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Card</h2>
            <button
              onClick={onClose}
              className="text-gray-500 text-2xl cursor-pointer hover:text-red-500 hover:bg-gray-200 rounded-md px-2"
            >
              ✕
            </button>
          </div>

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
            <div className="mb-4">
              <label htmlFor="cardFront" className="block text-gray-700 font-medium mb-2">
                Front
              </label>
              <textarea
                id="cardFront"
                value={cardFront}
                onChange={(e) => setCardFront(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter the front content of your card"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="cardBack" className="block text-gray-700 font-medium mb-2">
                Back
              </label>
              <textarea
                id="cardBack"
                value={cardBack}
                onChange={(e) => setCardBack(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter the back content of your card"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:bg-red-300 cursor-pointer"
              >
                Delete Card
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCardModal;
