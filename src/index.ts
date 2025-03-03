import { downloadAndSaveGongSpec } from './downloadGongApiSpec';
import { generateGongApiClient } from './generateGongApiClient';
import path from 'path';
import fs from 'fs';

/**
 * Configuration options for the Gong API client.
 */
export interface GongApiClientOptions {
  /**
   * Base URL for the Gong API.
   * @default 'https://app.gong.io'
   */
  baseUrl?: string;
  
  /**
   * API key for authentication.
   */
  apiKey?: string;
  
  /**
   * Access key for authentication.
   */
  accessKey?: string;
  
  /**
   * Path to the API specification file.
   * @default 'gong-openapi.json'
   */
  specFile?: string;
  
  /**
   * Directory to output the generated code.
   * @default 'src/generated'
   */
  outputDir?: string;
  
  /**
   * Whether to regenerate the client code.
   * @default false
   */
  regenerate?: boolean;
}

/**
 * Initializes the Gong API client.
 * @param options Configuration options for the Gong API client.
 * @returns A promise that resolves when the client is initialized.
 */
export async function initGongApiClient(options: GongApiClientOptions = {}): Promise<any> {
  const {
    baseUrl = process.env.GONG_BASE_URL || 'https://app.gong.io',
    apiKey = process.env.GONG_API_KEY,
    accessKey = process.env.GONG_ACCESS_KEY,
    specFile = process.env.GONG_SPEC_FILE || 'gong-openapi.json',
    outputDir = process.env.GONG_OUTPUT_DIR || 'src/generated',
    regenerate = false
  } = options;
  
  // Check if the client code already exists
  const generatedIndexPath = path.join(outputDir, 'index.ts');
  const clientExists = fs.existsSync(generatedIndexPath);
  
  // Regenerate the client code if requested or if it doesn't exist
  if (regenerate || !clientExists) {
    // Download the API specification if it doesn't exist or regenerate is true
    if (regenerate || !fs.existsSync(specFile)) {
      await downloadAndSaveGongSpec(specFile);
    }
    
    // Generate the client code
    await generateGongApiClient(specFile, outputDir);
  }
  
  // Import and configure the generated client
  try {
    // Dynamically import the generated client
    const generatedClient = await import(path.join(process.cwd(), outputDir));
    
    // Configure the client with the provided options
    if (generatedClient.OpenAPI) {
      generatedClient.OpenAPI.BASE = baseUrl;
      
      if (apiKey && accessKey) {
        generatedClient.OpenAPI.WITH_CREDENTIALS = true;
        generatedClient.OpenAPI.CREDENTIALS = 'include';
        generatedClient.OpenAPI.TOKEN = async () => {
          return `Bearer ${apiKey}:${accessKey}`;
        };
      }
    }
    
    return generatedClient;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error importing generated client: ${error.message}`);
    }
    throw error;
  }
}

// Re-export the downloadAndSaveGongSpec and generateGongApiClient functions
export { downloadAndSaveGongSpec, generateGongApiClient };

// Export a default object with all the functionality
export default {
  initGongApiClient,
  downloadAndSaveGongSpec,
  generateGongApiClient
};
