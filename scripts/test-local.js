#!/usr/bin/env node

/**
 * Local Testing Script
 *
 * This script helps you test the Gemini integration locally before deploying
 */

require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testConnection() {
  console.log('🧪 Testing Gemini API Connection...\n');

  // Check environment variables
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY not found in environment');
    console.log('\n📝 Steps to fix:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Add your Gemini API key to .env');
    console.log('3. Get API key from: https://makersuite.google.com/app/apikey\n');
    process.exit(1);
  }

  if (apiKey === 'your_gemini_api_key_here') {
    console.error('❌ Error: Please replace the placeholder API key in .env');
    console.log('\n📝 Get your API key from: https://makersuite.google.com/app/apikey\n');
    process.exit(1);
  }

  console.log('✅ API key found\n');

  // Test API connection
  try {
    console.log('🔌 Connecting to Gemini API...');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    console.log('📤 Sending test request...');
    const result = await model.generateContent('Say hello in 5 words or less');
    const response = await result.response;
    const text = response.text();

    console.log('📥 Response received:\n');
    console.log(`   "${text}"\n`);

    console.log('✅ Success! Your Gemini API is working correctly.\n');
    console.log('🎉 You can now use @gemini-cli in your GitHub issues!\n');
    console.log('📚 Next steps:');
    console.log('   1. Push your code to GitHub');
    console.log('   2. Add GEMINI_API_KEY to GitHub Secrets');
    console.log('   3. Create an issue and mention @gemini-cli\n');

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
