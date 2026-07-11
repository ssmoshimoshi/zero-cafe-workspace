#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const { initDb, storeMemory, recallMemory, queryIndex } = require('./database.js');
const { runIndexer } = require('./indexer.js');

async function main() {
  // 1. Initialize the SQLite Database
  await initDb();
  
  // 2. Scan and index codebase automatically on startup
  try {
    await runIndexer();
  } catch (err) {
    console.error("Gagal melakukan initial indexing:", err);
  }

  // 3. Setup the MCP Server
  const server = new Server(
    {
      name: 'antigravity-local-memory',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // 4. Register the Tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'memory_store',
          description: 'Store a lesson learned, bug pattern, or architectural decision persistently.',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Category of the memory (e.g., bug, architecture, rule)',
              },
              content: {
                type: 'string',
                description: 'The detailed content of the memory to store',
              },
            },
            required: ['category', 'content'],
          },
        },
        {
          name: 'memory_recall',
          description: 'Recall a stored memory based on a keyword search.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The keyword or phrase to search for in memories',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'codebase_query',
          description: 'Search for a function definition in the workspace to get its file and line number.',
          inputSchema: {
            type: 'object',
            properties: {
              functionName: {
                type: 'string',
                description: 'Name of the function to search for',
              },
            },
            required: ['functionName'],
          },
        },
        {
          name: 'codebase_reindex',
          description: 'Force a re-scan of the workspace files to update the codebase index.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
      case 'memory_store': {
        const { category, content } = request.params.arguments;
        try {
          const id = await storeMemory(category, content);
          return {
            content: [{ type: 'text', text: `Memory stored successfully with ID: ${id}. Category: ${category}` }],
          };
        } catch (error) {
          return { content: [{ type: 'text', text: `Failed to store memory: ${error.message}` }], isError: true };
        }
      }

      case 'memory_recall': {
        const { query } = request.params.arguments;
        try {
          const rows = await recallMemory(query);
          if (rows.length === 0) {
            return { content: [{ type: 'text', text: `No memories found matching the query: "${query}"` }] };
          }
          let resultText = `Found ${rows.length} memory entries:\n`;
          rows.forEach((row) => {
            resultText += `\n[ID: ${row.id} | Date: ${row.created_at} | Category: ${row.category}]\n${row.content}\n`;
          });
          return { content: [{ type: 'text', text: resultText }] };
        } catch (error) {
          return { content: [{ type: 'text', text: `Failed to recall memory: ${error.message}` }], isError: true };
        }
      }

      case 'codebase_query': {
        const { functionName } = request.params.arguments;
        try {
          const rows = await queryIndex(functionName);
          if (rows.length === 0) {
            return { content: [{ type: 'text', text: `Function "${functionName}" not found in the codebase index.` }] };
          }
          let resultText = `Found ${rows.length} matches for "${functionName}":\n`;
          rows.forEach((row) => {
            resultText += `- File: ${row.file_path}, Line: ${row.line_number}\n  Signature: ${row.signature}\n`;
          });
          return { content: [{ type: 'text', text: resultText }] };
        } catch (error) {
          return { content: [{ type: 'text', text: `Failed to query codebase: ${error.message}` }], isError: true };
        }
      }

      case 'codebase_reindex': {
        try {
          const count = await runIndexer();
          return { content: [{ type: 'text', text: `Codebase re-indexed successfully. Found ${count} functions.` }] };
        } catch (error) {
          return { content: [{ type: 'text', text: `Failed to re-index codebase: ${error.message}` }], isError: true };
        }
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  });

  // 5. Connect over stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Antigravity Local Memory & Codebase Intel MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
