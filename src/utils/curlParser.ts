import { CurlCommand, ParsedField } from '@/types/api';

export function parseCurlCommand(curlString: string): CurlCommand | null {
  try {
    // Remove 'curl' and extra whitespace
    let cleaned = curlString.trim().replace(/^curl\s+/i, '');
    
    // Extract URL
    const urlMatch = cleaned.match(/(['"]?)https?:\/\/[^\s'"]+\1/);
    if (!urlMatch) return null;
    
    const url = urlMatch[0].replace(/['"]/g, '');
    
    // Extract method
    const methodMatch = cleaned.match(/-X\s+(\w+)/i);
    const method = methodMatch ? methodMatch[1].toUpperCase() : 'GET';
    
    // Extract headers
    const headers: Record<string, string> = {};
    const headerMatches = cleaned.matchAll(/-H\s+['"]([^:]+):\s*([^'"]+)['"]/gi);
    for (const match of headerMatches) {
      headers[match[1].trim()] = match[2].trim();
    }
    
    // Extract body
    let body: any = undefined;
    const dataMatch = cleaned.match(/(?:-d|--data(?:-raw)?)\s+['"](.+?)['"]/s);
    if (dataMatch) {
      try {
        body = JSON.parse(dataMatch[1]);
      } catch {
        body = dataMatch[1];
      }
    }
    
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
