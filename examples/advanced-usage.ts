import { initGongApiClient, downloadAndSaveGongSpec, generateGongApiClient } from '../src';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * This example demonstrates advanced usage of the Gong API client.
 * 
 * To run this example:
 * 1. Create a .env file with your Gong API credentials (see .env.example)
 * 2. Run the example:
 *    ts-node examples/advanced-usage.ts
 */
async function main() {
  try {
    // Get API credentials from environment variables
    const baseUrl = process.env.GONG_BASE_URL;
    const apiKey = process.env.GONG_API_KEY;
    const accessKey = process.env.GONG_ACCESS_KEY;
    const specFile = process.env.GONG_SPEC_FILE || path.join(__dirname, 'custom-gong-api.json');
    const outputDir = process.env.GONG_OUTPUT_DIR || path.join(__dirname, 'custom-client');
    
    if (!baseUrl || !apiKey || !accessKey) {
      console.error('Error: GONG_BASE_URL, GONG_API_KEY, and GONG_ACCESS_KEY environment variables must be set');
      console.error('Please create a .env file based on the .env.example template');
      process.exit(1);
    }
    
    // Step 1: Download the API specification
    console.log('Downloading Gong API specification...');
    await downloadAndSaveGongSpec(specFile);
    
    // Step 2: Generate the client code
    console.log('Generating TypeScript client...');
    await generateGongApiClient(specFile, outputDir);
    
    // Step 3: Initialize the client with custom options
    console.log('Initializing Gong API client...');
    const gongClient = await initGongApiClient({
      baseUrl,
      apiKey,
      accessKey,
      specFile,
      outputDir,
      regenerate: false // We already generated the client code
    });
    
    console.log('Gong API client initialized successfully!');
    
    // Example: Working with calls
    console.log('\n=== Working with Calls ===');
    
    // Get calls from the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    console.log(`Fetching calls from ${sevenDaysAgo.toISOString()} to ${now.toISOString()}...`);
    
    // Note: This is a placeholder. The actual method name and parameters
    // will depend on the generated client code.
    /*
    const calls = await gongClient.CallsService.getCalls({
      from: sevenDaysAgo.toISOString(),
      to: now.toISOString(),
      limit: 10
    });
    
    console.log(`Found ${calls.length} calls`);
    
    // Get details for the first call
    if (calls.length > 0) {
      const callId = calls[0].id;
      console.log(`\nFetching details for call ${callId}...`);
      
      const callDetails = await gongClient.CallsService.getCall(callId);
      console.log('Call details:', JSON.stringify(callDetails, null, 2));
    }
    */
    
    // Example: Working with users
    console.log('\n=== Working with Users ===');
    
    // Note: This is a placeholder. The actual method name and parameters
    // will depend on the generated client code.
    /*
    console.log('Fetching users...');
    const users = await gongClient.UsersService.getUsers();
    console.log(`Found ${users.length} users`);
    
    // Get details for the first user
    if (users.length > 0) {
      const userId = users[0].id;
      console.log(`\nFetching details for user ${userId}...`);
      
      const userDetails = await gongClient.UsersService.getUser(userId);
      console.log('User details:', JSON.stringify(userDetails, null, 2));
    }
    */
    
    // Example: Working with statistics
    console.log('\n=== Working with Statistics ===');
    
    // Note: This is a placeholder. The actual method name and parameters
    // will depend on the generated client code.
    /*
    console.log('Fetching statistics...');
    const stats = await gongClient.StatsService.getStats({
      from: sevenDaysAgo.toISOString(),
      to: now.toISOString()
    });
    
    console.log('Statistics:', JSON.stringify(stats, null, 2));
    */
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main();
