import { CurlCommand, ParsedField } from '@/types/api';

export function parseCurlCommand(curlString: string): CurlCommand | null {
  try {
    // Remove extra whitespace and newlines
    let cleaned = curlString.trim().replace(/\\\s*\n\s*/g, ' ').replace(/\s+/g, ' ');
    
    // Remove 'curl' keyword
    cleaned = cleaned.replace(/^curl\s+/i, '');
    
    // Extract URL - handle both quoted and unquoted URLs
    const urlMatch = cleaned.match(/(['"])(https?:\/\/[^'"]+)\1|https?:\/\/[^\s]+/);
    if (!urlMatch) {
      console.error('No URL found in curl command');
      return null;
    }
    
    const url = (urlMatch[2] || urlMatch[0]).replace(/['"]/g, '').trim();
    
    // Extract method
    const methodMatch = cleaned.match(/-X\s+['"]?(\w+)['"]?/i);
    const method = methodMatch ? methodMatch[1].toUpperCase() : 'GET';
    
    // Extract headers - handle various formats
    const headers: Record<string, string> = {};
    const headerRegex = /-H\s+(['"])([^'"]+)\1/gi;
    let headerMatch;
    while ((headerMatch = headerRegex.exec(cleaned)) !== null) {
      const headerContent = headerMatch[2];
      const colonIndex = headerContent.indexOf(':');
      if (colonIndex > -1) {
        const key = headerContent.substring(0, colonIndex).trim();
        const value = headerContent.substring(colonIndex + 1).trim();
        headers[key] = value;
      }
    }
    
    // Extract body - handle -d, --data, --data-raw
    let body: any = undefined;
    const dataMatch = cleaned.match(/(?:-d|--data(?:-raw|-binary)?)\s+(['"])(.+?)\1/s);
    if (dataMatch) {
      const bodyContent = dataMatch[2];
      try {
        // Try to parse as JSON
        body = JSON.parse(bodyContent);
      } catch {
        // If not JSON, keep as string
        body = bodyContent;
      }
    }
    
    console.log('Parsed curl command:', { method, url, headers, body });
    return { method, url, headers, body };
  } catch (error) {
    console.error('Error parsing curl command:', error);
    return null;
  }
}

export function extractFields(curlCommand: CurlCommand): ParsedField[] {
  const fields: ParsedField[] = [];
  
  // Extract fields from headers
  Object.entries(curlCommand.headers).forEach(([name, value]) => {
    fields.push({
      name: `header.${name}`,
      value: value,
      type: 'string',
      isChangeable: false,
    });
  });
  
  // Extract fields from body
  if (curlCommand.body && typeof curlCommand.body === 'object') {
    extractFieldsFromObject(curlCommand.body, 'body', fields);
  }
  
  return fields;
}

function extractFieldsFromObject(
  obj: any,
  prefix: string,
  fields: ParsedField[]
): void {
  Object.entries(obj).forEach(([key, value]) => {
    const fieldName = `${prefix}.${key}`;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      extractFieldsFromObject(value, fieldName, fields);
    } else {
      fields.push({
        name: fieldName,
        value: String(value),
        type: inferType(value),
        isChangeable: false,
      });
    }
  });
}

function inferType(value: any): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'string') {
    // Check for common patterns
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return 'email';
    if (/^https?:\/\//.test(value)) return 'url';
  }
  return 'string';
}
