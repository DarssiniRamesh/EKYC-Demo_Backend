/**
 * Server bootstrap for EKYCBackendService.
 * - Loads environment variables from .env (if present)
 * - Accepts HOST/PORT from env and from CLI flags: --host, --port
 * - Binds Express app to 0.0.0.0:3001 by default
 */
require('dotenv').config();
const app = require('./app');

/**
 * Parse simple CLI arguments without external dependencies.
 * Supports:
 *  --port 3001 or --port=3001 (alias -p)
 *  --host 0.0.0.0 or --host=0.0.0.0 (alias -H)
 */
const args = process.argv.slice(2);
const getArgValue = (key) => {
  const idx = args.findIndex((a) => a === key || a.startsWith(`${key}=`));
  if (idx === -1) return undefined;
  const [k, v] = args[idx].split('=');
  if (typeof v !== 'undefined') return v;
  const next = args[idx + 1];
  return next && !String(next).startsWith('-') ? next : undefined;
};

const cliPort = getArgValue('--port') || getArgValue('-p');
const cliHost = getArgValue('--host') || getArgValue('-H');

/* Defaults: PORT=3001, HOST=0.0.0.0
   Precedence: CLI flags > env vars > defaults */
const PORT = parseInt(cliPort || process.env.PORT || '3001', 10);
const HOST = cliHost || process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
