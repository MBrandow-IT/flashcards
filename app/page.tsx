'use server';

import ShowCardSets from '@/components/core/ShowCardSets';
import CreateCardSet from '@/components/core/CreateCardSet';
import { getCardSets } from '@/lib/actions/cardSet.actions';

const Home = async () => {
  const cardSets = await getCardSets();

  if (!cardSets) {
    return <div>No card sets found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Create card set button */}
      <CreateCardSet />
      {/* Display existing card sets */}
      <ShowCardSets cardSets={cardSets} />
    </div>
  );
};

export default Home;
