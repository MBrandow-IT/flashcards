'use server';

import { executeQueryWithRetry } from '../db/dbConnection';
import { insertTableRecords } from '../db/tableActions';

export interface CreateCard {
  Card_Set_ID: number;
  Card_Front: string;
  Card_Back: string;
}

export interface UpdateCard {
  ID: number;
  Card_Front: string;
  Card_Back: string;
}

export const createCard = async (card: CreateCard) => {
  try {
    await executeQueryWithRetry({
      text: `INSERT INTO Cards (Card_Set_ID, Card_Front, Card_Back) VALUES (@param0, @param1, @param2)`,
      values: [card.Card_Set_ID, card.Card_Front, card.Card_Back],
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create card');
  }
};

export const createCards = async (cards: CreateCard[]) => {
  try {
    await insertTableRecords('Cards', cards);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create cards');
  }
};

export const getCards = async (Card_Set_ID: number) => {
  try {
    const result = await executeQueryWithRetry({
      text: `SELECT * FROM Cards WHERE Card_Set_ID = @param0`,
      values: [Card_Set_ID],
    });
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get cards');
  }
};

export const updateCard = async (card: UpdateCard) => {
  try {
    await executeQueryWithRetry({
      text: `UPDATE Cards SET Card_Front = @param0, Card_Back = @param1 WHERE ID = @param2`,
      values: [card.Card_Front, card.Card_Back, card.ID],
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update card');
  }
};

export const deleteCard = async (ID: number) => {
  try {
    await executeQueryWithRetry({ text: `DELETE FROM Cards WHERE ID = @param0`, values: [ID] });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete card');
  }
};
