'use client';

import { useState } from 'react';
import { createCardSet } from '@/lib/actions/cardSet.actions';
import { useRouter } from 'next/navigation';

const CreateCardSet = () => {
  const [cardSetName, setCardSetName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardSetName.trim()) return;

    try {
      setIsSubmitting(true);
      await createCardSet(cardSetName);
      setCardSetName('');
      // Refresh the page to show the new card set
      router.refresh();
    } catch (error) {
      console.error('Failed to create card set:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Create New Card Set</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={cardSetName}
          onChange={(e) => setCardSetName(e.target.value)}
          placeholder="Enter card set name"
          className="flex-grow p-2 border rounded"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !cardSetName.trim()}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Creating...' : 'Create Card Set'}
        </button>
      </form>
    </div>
  );
};

export default CreateCardSet;
