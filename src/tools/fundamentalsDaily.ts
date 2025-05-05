import { z } from 'zod';
import { TiingoToolDefinition } from './types.js';

const API_BASE = 'https://api.tiingo.com/tiingo/fundamentals';

const fundamentalsDailyInputSchemaShape = {
  ticker: z.string().describe('Ticker symbol of the asset'),
  startDate: z.string().optional().describe('Start date in YYYY-MM-DD format (optional)'),
  endDate: z.string().optional().describe('End date in YYYY-MM-DD format (optional)'),
  columns: z.string().optional().describe('Comma-separated list of columns/metrics to return (optional)'),
};

type Input = z.infer<z.ZodObject<typeof fundamentalsDailyInputSchemaShape>>;

export const fundamentalsDailyTool: TiingoToolDefinition = {
  name: 'get_fundamentals_daily_metrics',
  description: 'Fetches daily fundamental metrics for a given ticker.',
  inputSchemaShape: fundamentalsDailyInputSchemaShape,
  handler: async (input: Input): Promise<unknown> => {
    // Return raw JSON
    const { ticker, startDate, endDate, columns } = input;
    const token = process.env.TIINGO_API_TOKEN;
    if (!token) {
      throw new Error('TIINGO_API_TOKEN environment variable is not set.');
    }

    const url = new URL(`${API_BASE}/${ticker}/daily`);
    if (startDate) url.searchParams.append('startDate', startDate);
    if (endDate) url.searchParams.append('endDate', endDate);
    if (columns) url.searchParams.append('columns', columns);

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
