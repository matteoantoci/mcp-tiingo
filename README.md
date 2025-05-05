# MCP Tiingo Server

A Model Context Protocol (MCP) server that exposes various [Tiingo API](https://www.tiingo.com/documentation/general/overview) endpoints as tools. This server allows programmatic access to financial data including stock prices, news, forex, fundamentals, and corporate actions via the MCP protocol.

## Prerequisites

- Node.js (v18 or later recommended)
- npm (comes with Node.js)
- A Tiingo API Key
- (Optional) MCP-compatible client or runner (e.g., VSCode extension, CLI)

## Setup

1.  **Clone the repository or ensure you are in the project directory.**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set Tiingo API Key:**
    This server requires your Tiingo API key.
    *   If running the server **directly**, set the `TIINGO_API_TOKEN` environment variable in your shell:
        ```bash
        # Example for bash/zsh
        export TIINGO_API_TOKEN="YOUR_API_KEY_HERE"
        ```
        *(Replace `YOUR_API_KEY_HERE` with your actual Tiingo API key)*
    *   If running the server **via an MCP client**, you can typically provide the API key in the client's configuration (see "Via MCP runner" below).

4.  **Build the server:**
    ```bash
    npm run build
    ```
    This will create a `build` directory with the compiled JavaScript code.

## Running the Server

- **Directly:**
  ```bash
  npm run start
  ```
  or
  ```bash
  node build/index.js
  ```
  *(Ensure the `TIINGO_API_TOKEN` environment variable is set in the shell where you run this command)*

- **Via MCP runner:**
  Configure your MCP client to run the server using stdio transport. You can provide the `TIINGO_API_TOKEN` in the `env` block of the configuration.
  Example MCP settings entry:
  ```json
  "mcp-tiingo": {
    "transportType": "stdio",
    "command": "node",
    "args": [
      "/path/to/mcp-tiingo/build/index.js"
    ],
    "env": {
      "TIINGO_API_TOKEN": "YOUR_API_KEY_HERE"
    }
    // ... other optional settings ...
  }
  ```
  *(Replace `/path/to/mcp-tiingo` and `YOUR_API_KEY_HERE` accordingly)*

## Available Tools

The server exposes the following Tiingo API endpoints as tools via MCP:

### **get_end_of_day_prices**
- **Description:** Fetches End-of-Day prices for a given ticker symbol with optional date range and format.
- **Key Inputs:** `ticker`, `startDate`, `endDate`, `resampleFreq`

### **get_news**
- **Description:** Fetches news articles from Tiingo with various filtering options.
- **Key Inputs:** `tickers`, `tags`, `sources`, `startDate`, `endDate`, `limit`

### **get_forex_prices**
- **Description:** Fetches historical intraday Forex prices for a given ticker symbol with optional date range and frequency.
- **Key Inputs:** `ticker`, `startDate`, `endDate`, `resampleFreq`

### **get_forex_top_of_book**
- **Description:** Fetches real-time Forex Top-of-Book/Last data for one or more ticker symbols.
- **Key Inputs:** `ticker` or `tickers`

### **get_fundamentals_definitions**
- **Description:** Fetches available fundamental metrics and their definitions.
- **Key Inputs:** None

### **get_fundamentals_statements**
- **Description:** Fetches historical fundamental statement data (Balance Sheet, Income Statement, Cash Flow, Overview) for a given ticker.
- **Key Inputs:** `ticker`, `startDate`, `endDate`, `year`, `quarter`

### **get_fundamentals_daily_metrics**
- **Description:** Fetches daily fundamental metrics for a given ticker.
- **Key Inputs:** `ticker`, `startDate`, `endDate`, `columns`

### **get_fundamentals_meta**
- **Description:** Fetches fundamental meta data for companies.
- **Key Inputs:** None

### **get_dividend_distributions**
- **Description:** Fetches historical dividend and distribution data for a given ticker.
- **Key Inputs:** `ticker`, `startExDate`, `endExDate`

### **get_dividend_yield**
- **Description:** Fetches historical dividend yield data for a given ticker.
- **Key Inputs:** `ticker`, `startDate`, `endDate`, `columns`

### **get_splits**
- **Description:** Fetches historical split data for a given ticker.
- **Key Inputs:** `ticker`, `startExDate`, `endExDate`

## Extending

To add more Tiingo API endpoints as tools:
1. Create a new TypeScript file in `src/tools/` defining the tool's name, description, input schema (using Zod), and handler function to call the Tiingo API.
2. Import and add the tool definition object to the `tiingoTools` array in `src/tools/index.ts`.
3. Rebuild the server (`npm run build`).
