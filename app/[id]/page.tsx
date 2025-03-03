'use server';

import { getCards } from '@/lib/actions/cards.actions';
import CardSetDisplay from '@/components/core/CardSetDisplay';
import { getCardSet } from '@/lib/actions/cardSet.actions';

const CardSetPage = async ({ params }: { params: { id: string } }) => {
  const parsedParams = await params;
  const id = parseInt(parsedParams.id);
  const cards = await getCards(id);
  const cardSet = await getCardSet(id);

  return (
    <div className="container mx-auto p-4">
      <CardSetDisplay cardSetName={cardSet.Card_Set_Name} cards={cards} cardSetId={id} />
    </div>
  );
};

export default CardSetPage;
