import { z } from 'zod';
import { TiingoToolDefinition } from './types.js';

const API_BASE = 'https://api.tiingo.com/tiingo/fx';

const forexTopInputSchemaShape = {
  ticker: z.string().optional().describe('Forex ticker symbol (e.g., EURUSD)'),
  tickers: z.string().optional().describe('Comma-separated Forex ticker symbols (optional)'),
};

type Input = z.infer<z.ZodObject<typeof forexTopInputSchemaShape>>;

export const forexTopTool: TiingoToolDefinition = {
  name: 'get_forex_top_of_book',
  description: 'Fetches real-time Forex Top-of-Book/Last data for one or more ticker symbols.',
  inputSchemaShape: forexTopInputSchemaShape,
  handler: async (input: Input): Promise<unknown> => {
    // Return raw JSON
    const { ticker, tickers } = input;
    const token = process.env.TIINGO_API_TOKEN;
    if (!token) {
      throw new Error('TIINGO_API_TOKEN environment variable is not set.');
    }

    let url: URL;
    if (ticker) {
      url = new URL(`${API_BASE}/${ticker}/top`);
    } else if (tickers) {
      url = new URL(`${API_BASE}/top`);
      url.searchParams.append('tickers', tickers);
    } else {
      throw new Error('Either "ticker" or "tickers" must be provided.');
    }

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
