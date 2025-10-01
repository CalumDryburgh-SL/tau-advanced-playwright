module.exports = {
  apiKey: process.env.APPLITOOLS_API_KEY,
  appName: "DemoQA BookStore",
  batchName: "Profile API Interception Tests",
  branchName: "main",
  parentBranchName: "main",
  showLogs: true,
  saveDebugData: false,

  // Browser configurations
  browser: [
    { width: 1280, height: 720, name: "chrome" },
    { width: 768, height: 1024, name: "chrome" },
    { width: 1920, height: 1080, name: "firefox" },
  ],

  // Test configurations
  matchLevel: "Strict",
  useDom: true,
  enablePatterns: true,
  ignoreDisplacements: true,

  // Concurrency settings
  testConcurrency: 5,

  // Additional settings
  saveNewTests: true,
  saveFailedTests: true,

  // Server URL (if using on-premise)
  // serverUrl: 'https://your-applitools-server.com',
};
