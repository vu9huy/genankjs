import crypto from 'crypto';

/**
 * Generate a random GUID for Anki objects
 */
export function generateGuid(): bigint {
  // Generate 8 random bytes and convert to signed 64-bit integer
  const bytes = crypto.randomBytes(8);
  const buffer = Buffer.from(bytes);
  return buffer.readBigInt64BE(0);
}

/**
 * Generate a unique GUID with timestamp to avoid duplicates
 */
export function generateUniqueGuid(): bigint {
  const timestamp = BigInt(Date.now());
  const random = BigInt(Math.floor(Math.random() * 1000000));
  return timestamp * 1000000n + random;
}

/**
 * Convert timestamp to Anki time format
 */
export function ankiTime(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Generate a checksum for the collection
 */
export function generateChecksum(): number {
  return Math.floor(Math.random() * 1000000);
}

/**
 * Escape special characters for SQL
 */
export function sqlEscape(text: string): string {
  return text.replace(/'/g, "''");
}

/**
 * Join array elements with Anki field separator
 */
export function joinFields(fields: string[]): string {
  return fields.join('\x1f');
}

/**
 * Format tags for Anki
 */
export function formatTags(tags: string[]): string {
  if (tags.length === 0) return '';
  return ' ' + tags.join(' ') + ' ';
}

/**
 * Generate a random deck ID
 */
export function generateDeckId(): number {
  return Math.floor(Math.random() * 1000000000) + 1000000000;
}

/**
 * Generate a random model ID
 */
export function generateModelId(): number {
  return Math.floor(Date.now() / 1000) * 1000 + Math.floor(Math.random() * 1000);
}