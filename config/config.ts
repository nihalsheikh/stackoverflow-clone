const config = {
  // Clerk Authentication
  clerkAuthPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  // TinyMCE Editor API
  tinymceEditorApiKey: process.env.NEXT_PUBLIC_TINYMCE_EDITOR_API_KEY,
  // MongoDB URL
  mongoDbUrl: process.env.MONGODB_URL,
  // Clerk Webhook Secret
  clerkWebhookSigningSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
  // CHATGPT API Key
  openAiApiKey: process.env.OPENAI_API_KEY,
	// Google Gemini API Key
	googleGeminiApiKey: process.env.GOOGLE_GEMINI_API_KEY,
  // Server URL, in deployment change to real Public server url
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
};

export default config;
