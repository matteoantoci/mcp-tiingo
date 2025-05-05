import { z } from 'zod';
import { TiingoToolDefinition } from './types.js';

const API_BASE = 'https://api.tiingo.com/tiingo/fx';

const forexPricesInputSchemaShape = {
  ticker: z.string().describe('Forex ticker symbol (e.g., EURUSD)'),
  startDate: z.string().optional().describe('Start date in YYYY-MM-DD format (optional)'),
  endDate: z.string().optional().describe('End date in YYYY-MM-DD format (optional)'),
  resampleFreq: z.string().optional().describe('Resample frequency (e.g., 5min, 1day)'),
  // Removed format parameter
};

type Input = z.infer<z.ZodObject<typeof forexPricesInputSchemaShape>>;

export const forexPricesTool: TiingoToolDefinition = {
  name: 'get_forex_prices',
  description:
    'Fetches historical intraday Forex prices for a given ticker symbol with optional date range and frequency.',
  inputSchemaShape: forexPricesInputSchemaShape,
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
    if (resampleFreq) url.searchParams.append('resampleFreq', resampleFreq);
    // Removed format parameter

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
