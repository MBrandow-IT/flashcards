'use server';

import { executeQueryWithRetry } from '../db/dbConnection';

export interface CardSet {
  ID: number;
  Card_Set_Name: string;
}

export const createCardSet = async (CardSetName: string) => {
  try {
    await executeQueryWithRetry({
      text: `INSERT INTO Card_Sets (Card_Set_Name) VALUES (@param0)`,
      values: [CardSetName],
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create card set');
  }
};

export const getCardSets = async () => {
  try {
    const result = await executeQueryWithRetry({ text: `SELECT * FROM Card_Sets` });
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get card sets');
  }
};

export const getCardSet = async (id: number) => {
  try {
    const result = await executeQueryWithRetry({
      text: `SELECT * FROM Card_Sets WHERE ID = @param0`,
      values: [id],
    });
    return result.recordset[0];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get card set');
  }
};
