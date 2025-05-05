import { z } from 'zod';
import { TiingoToolDefinition } from './types.js';

const API_BASE = 'https://api.tiingo.com/tiingo/corporate-actions';

const splitsInputSchemaShape = {
  ticker: z.string().describe('Ticker symbol of the asset'),
  startExDate: z.string().optional().describe('Start ex-date in YYYY-MM-DD format (optional)'),
  endExDate: z.string().optional().describe('End ex-date in YYYY-MM-DD format (optional)'),
};

type Input = z.infer<z.ZodObject<typeof splitsInputSchemaShape>>;

export const splitsTool: TiingoToolDefinition = {
  name: 'get_splits',
  description: 'Fetches historical split data for a given ticker.',
  inputSchemaShape: splitsInputSchemaShape,
  handler: async (input: Input): Promise<unknown> => {
    // Return raw JSON
    const { ticker, startExDate, endExDate } = input;
    const token = process.env.TIINGO_API_TOKEN;
    if (!token) {
      throw new Error('TIINGO_API_TOKEN environment variable is not set.');
    }

    const url = new URL(`${API_BASE}/${ticker}/splits`);
    if (startExDate) url.searchParams.append('startExDate', startExDate);
    if (endExDate) url.searchParams.append('endExDate', endExDate);

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Tiingo API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const json = await response.json();
    return json; // Return raw JSON
  },
};
