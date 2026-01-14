#!/usr/bin/env node

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('📋 Fetching available models...\n');

    const models = await genAI.listModels();

    console.log('Available models:\n');
    models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Display name: ${model.displayName}`);
      console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ')}`);
      console.log();
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listModels();
