import { z } from 'zod';
import { TiingoToolDefinition } from './types.js';

const API_BASE = 'https://api.tiingo.com/tiingo/daily';

const endOfDayInputSchemaShape = {
  ticker: z.string().describe('Ticker symbol of the asset'),
  startDate: z.string().optional().describe('Start date in YYYY-MM-DD format (optional)'),
  endDate: z.string().optional().describe('End date in YYYY-MM-DD format (optional)'),
  resampleFreq: z.string().optional().describe('Resample frequency (e.g., daily, monthly)'),
};

type Input = z.infer<z.ZodObject<typeof endOfDayInputSchemaShape>>;

export const endOfDayTool: TiingoToolDefinition = {
  name: 'get_end_of_day_prices',
  description: 'Fetches End-of-Day prices for a given ticker symbol with optional date range and format.',
  inputSchemaShape: endOfDayInputSchemaShape,
  handler: async (input: Input): Promise<unknown> => {
    // Return raw JSON
    const { ticker, startDate, endDate, resampleFreq } = input;
    const token = process.env.TIINGO_API_TOKEN;
    if (!token) {
      throw new Error('TIINGO_API_TOKEN environment variable is not set.');
    }

    const url = new URL(`${API_BASE}/${ticker}/prices`);
    if (startDate) url.searchParams.append('startDate', startDate);
    if (endDate) url.searchParams.append('endDate', endDate);
    // Removed format parameter
    if (resampleFreq) url.searchParams.append('resampleFreq', resampleFreq);

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
