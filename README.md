# Gong API Client

A Node.js library that automatically generates a TypeScript client for the Gong API from the OpenAPI specification.

This package provides two approaches to working with the Gong API:
1. **Generated TypeScript Client**: A fully typed client generated from the OpenAPI specification
2. **Direct HTTP Requests**: A simpler approach using direct HTTP requests with basic authentication

## Features

- Automatically downloads the latest Gong API specification
- Generates TypeScript client code organized by API endpoint groups
- Provides a simple interface for interacting with the Gong API
- Supports authentication with API key and access key
- Includes TypeScript type definitions for all API requests and responses
- Offers a direct HTTP request approach for simpler use cases

## Installation

```bash
npm install gong-api-client
```

For the direct HTTP approach, you only need axios:

```bash
npm install axios
```

## Authentication

The Gong API uses basic authentication with your API credentials:

- **Access Key**: Used as the username
- **Access Key Secret**: Used as the password

## Configuration

You can configure the Gong API client using environment variables or by passing options directly to the `initGongApiClient` function.

### Using Environment Variables

Create a `.env` file in your project root:

```
# Gong API Configuration
GONG_BASE_URL=https://api.gong.io
GONG_API_KEY=your-api-key
GONG_ACCESS_KEY=your-access-key

# Optional: Specify custom paths for the API specification and generated client
# GONG_SPEC_FILE=./custom-gong-api.json
# GONG_OUTPUT_DIR=./custom-client
```

Then load the environment variables in your code:

```typescript
import { initGongApiClient } from 'gong-api-client';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main() {
  // Initialize the client (will use environment variables automatically)
  const gongClient = await initGongApiClient();
  
  // Use the client to make API calls
  // ...
}
```

### Direct Configuration

```typescript
import { initGongApiClient } from 'gong-api-client';

async function main() {
  // Initialize the client with explicit options
  const gongClient = await initGongApiClient({
    baseUrl: 'https://api.gong.io',
    apiKey: 'your-api-key',
    accessKey: 'your-access-key'
  });

  // Use the client to make API calls
  // ...
}
```

## Usage

### Direct HTTP Approach

This simpler approach uses direct HTTP requests with basic authentication:

```javascript
const axios = require('axios');

// Your Gong API credentials
const baseUrl = 'https://api.gong.io';
const accessKey = 'YOUR_ACCESS_KEY';
const accessKeySecret = 'YOUR_ACCESS_KEY_SECRET';

// Create a client with basic authentication
const gongClient = axios.create({
  baseURL: baseUrl,
  auth: {
    username: accessKey,
    password: accessKeySecret
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

// Make API requests
async function getUsers() {
  try {
    const response = await gongClient.get('/v2/users');
    console.log(`Retrieved ${response.data.records.totalRecords} users`);
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

getUsers();
```

### Generated Client Approach

```typescript
import { initGongApiClient } from 'gong-api-client';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main() {
  // Initialize the client
  const gongClient = await initGongApiClient();

  // Use the client to make API calls
  try {
    // Example: Get all users
    const users = await gongClient.UsersService.getUsers();
    console.log('Users:', users);

    // Example: Get call details
    const callId = '123456789';
    const call = await gongClient.CallsService.getCall(callId);
    console.log('Call details:', call);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

### Advanced Usage

```typescript
import { initGongApiClient, downloadAndSaveGongSpec, generateGongApiClient } from 'gong-api-client';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

async function main() {
  // Download the latest API specification
  const specFile = path.join(__dirname, 'custom-gong-api.json');
  await downloadAndSaveGongSpec(specFile);

  // Generate the client code
  const outputDir = path.join(__dirname, 'custom-client');
  await generateGongApiClient(specFile, outputDir);

  // Initialize the client with custom options
  const gongClient = await initGongApiClient({
    baseUrl: process.env.GONG_BASE_URL,
    apiKey: process.env.GONG_API_KEY,
    accessKey: process.env.GONG_ACCESS_KEY,
    specFile,
    outputDir,
    regenerate: false // We already generated the client code
  });

  // Use the client to make API calls
  // ...
}

main();
```

## API Reference

### initGongApiClient(options)

Initializes the Gong API client.

#### Options

- `baseUrl` (string, optional): Base URL for the Gong API. Default: 'https://api.gong.io'
- `apiKey` (string, optional): API key for authentication.
- `accessKey` (string, optional): Access key for authentication.
- `specFile` (string, optional): Path to the API specification file. Default: 'gong-openapi.json'
- `outputDir` (string, optional): Directory to output the generated code. Default: 'src/generated'
- `regenerate` (boolean, optional): Whether to regenerate the client code. Default: false

#### Returns

A promise that resolves to the generated client object.

### downloadAndSaveGongSpec(outputFile)

Downloads the Gong API specification and saves it to a file.

#### Parameters

- `outputFile` (string, optional): Path to save the API specification. Default: 'gong-openapi.json'

#### Returns

A promise that resolves to the path of the saved file.

### generateGongApiClient(specFile, outputDir)

Generates TypeScript client code from the Gong API specification.

#### Parameters

- `specFile` (string, optional): Path to the API specification file. Default: 'gong-openapi.json'
- `outputDir` (string, optional): Directory to output the generated code. Default: 'src/generated'

#### Returns

A promise that resolves when the client code has been generated.

## Common API Endpoints

- `/v2/users` - Get a list of users
- `/v2/users/{userId}` - Get details for a specific user
- `/v2/calls` - Get a list of calls
- `/v2/calls/{callId}` - Get details for a specific call

## API Structure

The generated client provides direct access to all services and models from the Gong API:

### Services

The client exposes service classes that correspond to the different functional areas of the Gong API:

- `CallsService`: Methods for working with call recordings
- `UsersService`: Methods for managing users
- `StatsService`: Methods for retrieving statistics
- `SettingsService`: Methods for managing settings
- `DataPrivacyService`: Methods for data privacy operations
- `LibraryService`: Methods for library operations
- `CRMService`: Methods for CRM integration
- `AuditingService`: Methods for auditing operations
- `MeetingsService`: Methods for meeting operations (Beta)
- `PermissionsService`: Methods for permission management
- `EngageFlowsService`: Methods for engage flows
- `DigitalInteractionsService`: Methods for digital interactions
- `IntegrationSettingsService`: Methods for integration settings

### Models

The client also provides TypeScript interfaces for all data models used in the API:

- Request and response types for all API operations
- Data models for entities like calls, users, statistics, etc.

## Best Practices

1. **Error Handling**: Always implement proper error handling for API requests
2. **Rate Limiting**: Be mindful of API rate limits
3. **Pagination**: Use pagination for endpoints that return large datasets
4. **Security**: Keep your API credentials secure and never commit them to version control

## Troubleshooting

- If you receive a 401 Unauthorized error, check that your API credentials are correct
- If you're using the generated client and encounter errors, try the direct HTTP approach with axios
- Make sure your API key has the necessary permissions for the endpoints you're trying to access

## Development

### Building the Library

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Continuous Integration and Deployment

This project uses GitHub Actions for continuous integration and deployment.

### CI Workflow

The CI workflow runs on every push to the main branch and on pull requests. It:

- Builds the project on multiple Node.js versions
- Runs tests (when added)

### Publishing to npm

The package is automatically published to npm when:

- Changes are pushed to the main branch that modify package.json
- A new GitHub release is created
- The workflow is manually triggered

To set up automatic publishing:

1. Generate an npm access token:
   - Go to npmjs.com and log in
   - Click on your profile icon → Access Tokens
   - Click "Generate New Token" (select "Automation" type)
   - Copy the generated token

2. Add the token to GitHub repository secrets:
   - Go to your GitHub repository
   - Click on Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: paste your npm token
   - Click "Add secret"

## License

MIT

## Author

Aaron Bockelie
