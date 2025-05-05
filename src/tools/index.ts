import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { endOfDayTool } from './endOfDay.js';
import { newsTool } from './news.js';
import { forexPricesTool } from './forexPrices.js';
import { forexTopTool } from './forexTop.js';
import { fundamentalsDefinitionsTool } from './fundamentalsDefinitions.js';
import { fundamentalsStatementsTool } from './fundamentalsStatements.js';
import { fundamentalsDailyTool } from './fundamentalsDaily.js';
import { fundamentalsMetaTool } from './fundamentalsMeta.js';
import { dividendsDistributionsTool } from './dividendsDistributions.js';
import { dividendsYieldTool } from './dividendsYield.js';
import { splitsTool } from './splits.js';

type TiingoToolDefinition = {
  name: string;
  description: string;
  inputSchemaShape: z.ZodRawShape;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (input: any) => Promise<any>;
};

const tiingoTools: TiingoToolDefinition[] = [
  endOfDayTool,
  newsTool,
  forexPricesTool,
  forexTopTool,
  fundamentalsDefinitionsTool,
  fundamentalsStatementsTool,
  fundamentalsDailyTool,
  fundamentalsMetaTool,
  dividendsDistributionsTool,
  dividendsYieldTool,
  splitsTool,
];

export const registerTiingoTools = (server: McpServer): void => {
  tiingoTools.forEach((tool) => {
    try {
      server.tool(tool.name, tool.description, tool.inputSchemaShape, async (input) => {
        const result = await tool.handler(input);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      });
      console.log(`Registered Tiingo tool: ${tool.name}`);
    } catch (error) {
      console.error(`Failed to register Tiingo tool ${tool.name}:`, error);
    }
  });
};
