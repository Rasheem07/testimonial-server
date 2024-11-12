import { PostgresClient } from "../lib/db";

export const createSchema = async (query: string) => {

  try {
      await PostgresClient.query(query);  
  } catch (error) {
    console.error("Error creating users table", error);
  }
};
