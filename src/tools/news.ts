import { z } from 'zod';
import { TiingoToolDefinition } from './types.js';

const API_BASE = 'https://api.tiingo.com/tiingo/news';

const newsInputSchemaShape = {
  tickers: z.string().optional().describe('Comma-separated ticker symbols (optional)'),
  tags: z.string().optional().describe('Comma-separated tags (optional)'),
  countries: z.string().optional().describe('Comma-separated country codes (optional)'),
  topics: z.string().optional().describe('Comma-separated topics (optional)'),
  sources: z.string().optional().describe('Comma-separated news sources (optional)'),
  startDate: z.string().optional().describe('Start date in YYYY-MM-DD format (optional)'),
  endDate: z.string().optional().describe('End date in YYYY-MM-DD format (optional)'),
  limit: z.number().int().optional().describe('Maximum number of articles to return (optional)'),
  sortBy: z.enum(['publishedDate', 'crawlDate']).optional().describe('Sort by publishedDate or crawlDate (optional)'),
  sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (asc or desc, optional)'),
};

type Input = z.infer<z.ZodObject<typeof newsInputSchemaShape>>;

export const newsTool: TiingoToolDefinition = {
  name: 'get_news',
  description: 'Fetches news articles from Tiingo with various filtering options.',
  inputSchemaShape: newsInputSchemaShape,
  handler: async (input: Input): Promise<unknown> => {
    // Return raw JSON
    const { tickers, tags, countries, topics, sources, startDate, endDate, limit, sortBy, sortOrder } = input;
    const token = process.env.TIINGO_API_TOKEN;
    if (!token) {
      throw new Error('TIINGO_API_TOKEN environment variable is not set.');
    }

    const url = new URL(API_BASE);
    if (tickers) url.searchParams.append('tickers', tickers);
    if (tags) url.searchParams.append('tags', tags);
    if (countries) url.searchParams.append('countries', countries);
    if (topics) url.searchParams.append('topics', topics);
    if (sources) url.searchParams.append('sources', sources);
    if (startDate) url.searchParams.append('startDate', startDate);
    if (endDate) url.searchParams.append('endDate', endDate);
    if (limit) url.searchParams.append('limit', limit.toString());
    if (sortBy) url.searchParams.append('sortBy', sortBy);
    if (sortOrder) url.searchParams.append('sortOrder', sortOrder);

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
