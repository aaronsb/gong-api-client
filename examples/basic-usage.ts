import { initGongApiClient } from '../src';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * This example demonstrates how to use the Gong API client.
 * 
 * To run this example:
 * 1. Create a .env file with your Gong API credentials (see .env.example)
 * 2. Run the example:
 *    npm run example
 */
async function main() {
  try {
    // Get API credentials from environment variables
    const baseUrl = process.env.GONG_BASE_URL;
    const apiKey = process.env.GONG_API_KEY;
    const accessKey = process.env.GONG_ACCESS_KEY;
    
    if (!baseUrl || !apiKey || !accessKey) {
      console.error('Error: GONG_BASE_URL, GONG_API_KEY, and GONG_ACCESS_KEY environment variables must be set');
      console.error('Please create a .env file based on the .env.example template');
      process.exit(1);
    }
    
    console.log('Initializing Gong API client...');
    
    // Initialize the client
    const gongClient = await initGongApiClient({
      baseUrl,
      apiKey,
      accessKey,
      regenerate: true // Force regeneration of the client code
    });
    
    console.log('Gong API client initialized successfully!');
    console.log('Available API groups:');
    
    // List available services
    console.log('Available services:');
    const services = Object.keys(gongClient)
      .filter(key => key.endsWith('Service') && typeof gongClient[key] === 'object');
    
    services.forEach(service => {
      console.log(`- ${service}`);
      
      // List methods in each service
      const methods = Object.keys(gongClient[service])
        .filter(key => typeof gongClient[service][key] === 'function');
      
      methods.forEach(method => {
        console.log(`  - ${method}`);
      });
    });
    
    // Example API calls (uncomment to use)
    
    // Example 1: Get all users
    // console.log('\nFetching users...');
    // const users = await gongClient.UsersService.getUsers();
    // console.log(`Found ${users.length} users`);
    
    // Example 2: Get call details
    // const callId = '123456789';
    // console.log(`\nFetching call details for call ${callId}...`);
    // const call = await gongClient.CallsService.getCall(callId);
    // console.log('Call details:', call);
    
    // Example 3: Get statistics
    // console.log('\nFetching statistics...');
    // const stats = await gongClient.StatsService.getStats();
    // console.log('Statistics:', stats);
    
    // Example 4: Using cursor-based pagination to get all calls
    // console.log('\nFetching all calls with pagination...');
    // 
    // // Define time range for the last 30 days
    // const now = new Date();
    // const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    // 
    // // Function to get all calls using pagination
    // async function getAllCalls() {
    //   const allCalls = [];
    //   let cursor = undefined;
    //   
    //   do {
    //     // Make API call with cursor if available
    //     const response = await gongClient.CallsService.listCalls({
    //       fromDateTime: thirtyDaysAgo.toISOString(),
    //       toDateTime: now.toISOString(),
    //       cursor: cursor
    //     });
    //     
    //     // Add calls from this page to our collection
    //     if (response.calls && response.calls.length > 0) {
    //       allCalls.push(...response.calls);
    //       console.log(`Retrieved page with ${response.calls.length} calls (total: ${allCalls.length})`);
    //     }
    //     
    //     // Get cursor for next page if available
    //     cursor = response.records?.cursor;
    //   } while (cursor); // Continue until no more pages
    //   
    //   return allCalls;
    // }
    // 
    // const allCalls = await getAllCalls();
    // console.log(`Retrieved a total of ${allCalls.length} calls`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main();
