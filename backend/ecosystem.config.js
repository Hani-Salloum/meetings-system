/* eslint-disable no-undef */
module.exports = {
  apps: [
    {
      name: "meeting-service-demo",
      script: "dist/server.js",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3333,
      },
    },
  ],
};
