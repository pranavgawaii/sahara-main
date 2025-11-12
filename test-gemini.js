import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBLO_ub3BAjVq8-M_RF9blgMER1TkTgCqE';
const genAI = new GoogleGenerativeAI(API_KEY);

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Hello, can you respond with a simple greeting?');
    const response = await result.response;
    const text = response.text();
    
    console.log('Success! Gemini responded:', text);
  } catch (error) {
    console.error('Error testing Gemini API:', error);
    console.error('Error details:', error.message);
  }
}

testGemini();