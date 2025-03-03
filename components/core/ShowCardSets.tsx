'use client';

import { useState } from 'react';
import { CardSet } from '@/lib/actions/cardSet.actions';
import Link from 'next/link';

const ShowCardSets = ({ cardSets }: { cardSets: CardSet[] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCardSets = cardSets.filter((cardSet) =>
    cardSet.Card_Set_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Card Sets</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search card sets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>

      {filteredCardSets.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          {searchTerm ? 'No matching card sets found' : 'No card sets yet. Create your first one!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCardSets.map((cardSet) => (
            <div
              key={cardSet.ID}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{cardSet.Card_Set_Name}</h3>
              <div className="flex gap-2 mt-3">
                <Link
                  href={`/${cardSet.ID}`}
                  className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                >
                  View Cards
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowCardSets;
