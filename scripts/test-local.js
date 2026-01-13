#!/usr/bin/env node

/**
 * Local Testing Script
 *
 * This script helps you test the Gemini integration locally before deploying
 */

require('dotenv').config();

const { VertexAI } = require('@google-cloud/vertexai');

async function testConnection() {
  console.log('🧪 Testing Vertex AI (Gemini) API Connection...\n');

  // Check environment variables
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

  if (!projectId) {
    console.error('❌ Error: GOOGLE_CLOUD_PROJECT_ID not found in environment');
    console.log('\n📝 Steps to fix:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Add your Google Cloud Project ID to .env');
    console.log('3. Set up authentication (see setup guide)\n');
    process.exit(1);
  }

  if (projectId === 'your-project-id') {
    console.error('❌ Error: Please replace the placeholder project ID in .env');
    console.log('\n📝 Add your actual Google Cloud Project ID\n');
    process.exit(1);
  }

  console.log(`✅ Project ID found: ${projectId}`);
  console.log(`✅ Location: ${location}\n`);

  // Test API connection
  try {
    console.log('🔌 Connecting to Vertex AI...');
    const vertexAI = new VertexAI({ project: projectId, location: location });
    const model = vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

    console.log('📤 Sending test request...');
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: 'Say hello in 5 words or less' }] }] });
    const response = result.response;
    const text = response.candidates[0].content.parts[0].text;

    console.log('📥 Response received:\n');
    console.log(`   "${text}"\n`);

    console.log('✅ Success! Your Vertex AI (Gemini) API is working correctly.\n');
    console.log('🎉 You can now use @gemini-cli in your GitHub issues!\n');
    console.log('📚 Next steps:');
    console.log('   1. Push your code to GitHub');
    console.log('   2. Add GOOGLE_CLOUD_PROJECT_ID to GitHub Secrets');
    console.log('   3. Set up Workload Identity Federation (see setup guide)');
    console.log('   4. Create an issue and mention @gemini-cli\n');

  } catch (error) {
    console.error('❌ Error connecting to Gemini API:\n');
    console.error(`   ${error.message}\n`);

    if (error.message.includes('API_KEY_INVALID')) {
      console.log('💡 Your API key appears to be invalid.');
      console.log('   Get a new one from: https://makersuite.google.com/app/apikey\n');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.log('💡 API access denied. Make sure:');
      console.log('   1. Generative Language API is enabled in your project');
      console.log('   2. Your API key has the correct permissions\n');
    } else {
      console.log('💡 Check your internet connection and try again.\n');
    }

    process.exit(1);
  }
}

// Run the test
testConnection().catch(console.error);
