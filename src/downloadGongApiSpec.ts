import axios from 'axios';
import fs from 'fs';
import path from 'path';

/**
 * Downloads the Gong API specification from the Gong API.
 * @returns The API specification as a JSON object.
 */
export async function downloadGongSpec(): Promise<any> {
  const url = 'https://gong.app.gong.io/ajax/settings/api/documentation/specs?version=';
  
  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error downloading API spec: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Saves the API specification to a file.
 * @param spec The API specification object.
 * @param outputFile Path to save the file.
 */
export function saveSpec(spec: any, outputFile: string): void {
  try {
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(spec, null, 2));
    console.log(`Saved API specification to ${outputFile}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error saving API spec: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Main function to download and save the Gong API specification.
 * @param outputFile Path to save the API specification.
 */
export async function downloadAndSaveGongSpec(outputFile: string = 'gong-openapi.json'): Promise<string> {
  console.log('Downloading Gong API specification...');
  const spec = await downloadGongSpec();
  saveSpec(spec, outputFile);
  return outputFile;
}

// If this file is run directly
if (require.main === module) {
  const outputFile = process.argv[2] || 'gong-openapi.json';
  downloadAndSaveGongSpec(outputFile)
    .then(() => console.log('Done!'))
    .catch(error => {
      console.error(error.message);
      process.exit(1);
    });
}
