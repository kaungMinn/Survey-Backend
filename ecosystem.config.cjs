module.exports = {
  apps: [
    {
      name: 'survey-api',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        // Add any other environment variables your app needs here
      },
    },
  ],
};