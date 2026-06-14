# ──────────────────────────────────────────────────────────────────────────────
# Chrani Catalog — PM2 Ecosystem Configuration
#
# Usage (production server):
#   pm2 start ecosystem.config.cjs
#   pm2 save
#   pm2 startup   ← follow the printed command to enable auto-restart on reboot
#
# Useful commands:
#   pm2 status          — list running apps
#   pm2 logs chrani     — stream logs
#   pm2 reload chrani   — zero-downtime reload
#   pm2 stop chrani     — stop
#   pm2 delete chrani   — remove from PM2
# ──────────────────────────────────────────────────────────────────────────────

module.exports = {
  apps: [
    {
      name: "chrani",
      script: "node_modules/.bin/next",
      args: "start",

      // ── Scaling ─────────────────────────────────────────────────────────────
      // "max" uses all available CPU cores. For a VPS with 2 vCPUs start with 2.
      // Adjust based on your server. For a single-CPU server use 1.
      instances: "max",
      exec_mode: "cluster",

      // ── Process management ─────────────────────────────────────────────────
      autorestart: true,
      watch: false, // Do NOT watch files in production
      max_memory_restart: "512M",

      // ── Environment ────────────────────────────────────────────────────────
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // ── Logging ────────────────────────────────────────────────────────────
      // Rotate logs daily to prevent disk exhaustion.
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,
      log_type: "json",

      // ── Restart policy ─────────────────────────────────────────────────────
      // Exponential back-off: wait up to 10 s between restarts.
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 3000,

      // ── Graceful shutdown ──────────────────────────────────────────────────
      // Give in-flight requests 30 s to complete before killing the process.
      kill_timeout: 30000,
      listen_timeout: 8000,
    },
  ],
};
