import { z } from 'zod';
import { TiingoToolDefinition } from './types.js';

const API_BASE = 'https://api.tiingo.com/tiingo/fundamentals';

const fundamentalsStatementsInputSchemaShape = {
  ticker: z.string().describe('Ticker symbol of the asset'),
  startDate: z.string().optional().describe('Start date in YYYY-MM-DD format (optional)'),
  endDate: z.string().optional().describe('End date in YYYY-MM-DD format (optional)'),
  year: z.number().int().optional().describe('Fiscal year (optional)'),
  quarter: z.number().int().optional().describe('Fiscal quarter (1-4, 0 for annual, optional)'),
};

type Input = z.infer<z.ZodObject<typeof fundamentalsStatementsInputSchemaShape>>;

export const fundamentalsStatementsTool: TiingoToolDefinition = {
  name: 'get_fundamentals_statements',
  description:
    'Fetches historical fundamental statement data (Balance Sheet, Income Statement, Cash Flow, Overview) for a given ticker.',
  inputSchemaShape: fundamentalsStatementsInputSchemaShape,
  handler: async (input: Input): Promise<unknown> => {
    // Return raw JSON
    const { ticker, startDate, endDate, year, quarter } = input;
    const token = process.env.TIINGO_API_TOKEN;
    if (!token) {
      throw new Error('TIINGO_API_TOKEN environment variable is not set.');
    }

    const url = new URL(`${API_BASE}/${ticker}/statements`);
    if (startDate) url.searchParams.append('startDate', startDate);
    if (endDate) url.searchParams.append('endDate', endDate);
    if (year) url.searchParams.append('year', year.toString());
    if (quarter) url.searchParams.append('quarter', quarter.toString());

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
