'use strict';

/**
 * Entry point shim for EKYCBackendService.
 *
 * Purpose:
 * - Ensure "node ." starts the Express server reliably in preview environments.
 * - Tolerate and ignore unknown CLI args passed by runners.
 * - Optionally map some common bind flags to HOST/PORT env vars, but default to 0.0.0.0:3001.
 *
 * Behavior:
 * - Defaults: HOST=0.0.0.0, PORT=3001 (server also enforces this)
 * - Recognized flags (non-fatal, optional):
 *   --host, -H
 *   --port, -p
 *   --bind, -b   // format: host:port (e.g., 0.0.0.0:3001)
 *
 * Any other args are ignored safely.
 */

// Best-effort map a few common flags to env if not already provided.
(function mapCommonFlagsToEnv() {
  try {
    const args = process.argv.slice(2);

    // Helper to fetch either "--key value" or "--key=value" or "-k value"
    const getArgValue = (longKey, shortKey) => {
      const findVal = (key) => {
        const idx = args.findIndex(a => a === key || a.startsWith(`${key}=`));
        if (idx === -1) return undefined;
        const [k, v] = args[idx].split('=');
        if (typeof v !== 'undefined') return v;
        const next = args[idx + 1];
        return next && !String(next).startsWith('-') ? next : undefined;
      };
      return findVal(longKey) ?? (shortKey ? findVal(shortKey) : undefined);
    };

    // Map --host/-H
    const cliHost = getArgValue('--host', '-H');
    if (cliHost && !process.env.HOST) {
      process.env.HOST = cliHost;
    }

    // Map --port/-p
    const cliPort = getArgValue('--port', '-p');
    if (cliPort && !process.env.PORT) {
      process.env.PORT = cliPort;
    }

    // Map gunicorn-style --bind/-b "host:port"
    const bind = getArgValue('--bind', '-b');
    if (bind && (!process.env.HOST || !process.env.PORT)) {
      const [bindHost, bindPort] = String(bind).split(':');
      if (bindHost && !process.env.HOST) process.env.HOST = bindHost;
      if (bindPort && !process.env.PORT && /^\d+$/.test(bindPort)) process.env.PORT = bindPort;
    }

    // Set sane defaults if not provided anywhere
    if (!process.env.HOST) process.env.HOST = '0.0.0.0';
    if (!process.env.PORT) process.env.PORT = '3001';
  } catch {
    // Never crash due to arg parsing; rely on server defaults
    if (!process.env.HOST) process.env.HOST = '0.0.0.0';
    if (!process.env.PORT) process.env.PORT = '3001';
  }
})();

// Start the actual server (Express app with /health route)
require('./src/server');
