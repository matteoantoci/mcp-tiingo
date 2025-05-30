import { TiingoToolDefinition } from './types.js';

const API_BASE = 'https://api.tiingo.com/tiingo/fundamentals/definitions';

const fundamentalsDefinitionsInputSchemaShape = {
  // This endpoint does not require any parameters
};

export const fundamentalsDefinitionsTool: TiingoToolDefinition = {
  name: 'get_fundamentals_definitions',
  description: 'Fetches available fundamental metrics and their definitions.',
  inputSchemaShape: fundamentalsDefinitionsInputSchemaShape,
  handler: async (): Promise<unknown> => {
    const token = process.env.TIINGO_API_TOKEN;
    if (!token) {
      throw new Error('TIINGO_API_TOKEN environment variable is not set.');
    }

    const url = new URL(API_BASE);

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
    return json;
  },
};
