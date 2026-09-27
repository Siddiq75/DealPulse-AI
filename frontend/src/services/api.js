let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8000/api/v1' : '/api/v1');
rawBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');

// Automatically ensure /api/v1 suffix if user entered root domain without /api/v1
if (rawBaseUrl.startsWith('http') && !rawBaseUrl.endsWith('/api/v1')) {
  rawBaseUrl = `${rawBaseUrl}/api/v1`;
}

const API_BASE_URL = rawBaseUrl;

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Account operations
  getAccounts: async () => {
    const response = await client.get('/accounts');
    return response.data;
  },

  getAccount: async (accountId) => {
    const response = await client.get(`/accounts/${accountId}`);
    return response.data;
  },

  createAccount: async (accountData) => {
    const response = await client.post('/accounts', accountData);
    return response.data;
  },

  // Hindsight Memory operations
  retainMemory: async (accountId, content, category = 'fact', tags = []) => {
    const response = await client.post('/memory/retain', {
      account_id: accountId,
      content,
      category,
      tags,
    });
    return response.data;
  },

  recallMemories: async (accountId, query, topK = 5) => {
    const response = await client.post('/memory/recall', {
      account_id: accountId,
      query,
      top_k: topK,
    });
    return response.data;
  },

  reflectOnAccount: async (accountId, query) => {
    const response = await client.post('/memory/reflect', {
      account_id: accountId,
      query,
    });
    return response.data;
  },

  getBankMemories: async (accountId) => {
    const response = await client.get(`/memory/bank/${accountId}`);
    return response.data;
  },

  // AI Agent & Pitch Generator operations
  generatePitch: async (accountId, prompt, useHindsight = true) => {
    const response = await client.post('/agent/generate', {
      account_id: accountId,
      prompt,
      use_hindsight: useHindsight,
    });
    return response.data;
  },

  comparePitches: async (accountId, prompt) => {
    const response = await client.post('/agent/compare', {
      account_id: accountId,
      prompt,
    });
    return response.data;
  },

  // Hackathon Demo Walkthrough operations
  getDemoScenarios: async () => {
    const response = await client.get('/demo/scenarios');
    return response.data;
  },

  resetDemoState: async () => {
    const response = await client.post('/demo/reset');
    return response.data;
  },
};
