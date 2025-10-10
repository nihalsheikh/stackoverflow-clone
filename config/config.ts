const config = {
  // Clerk Authentication
  clerkAuthPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  // TinyMCE Editor API
  tinymceEditorApiKey: process.env.NEXT_PUBLIC_TINYMCE_EDITOR_API_KEY,
  // MongoDB URL
  mongoDbUrl: process.env.MONGODB_URL,
};

export default config;
