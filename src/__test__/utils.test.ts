import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateGuid,
  generateUniqueGuid,
  ankiTime,
  joinFields,
  formatTags,
  generateDeckId,
  generateModelId,
} from '../utils.js';

describe('Utils', () => {
  describe('generateGuid', () => {
    it('should generate a valid bigint GUID', () => {
      const guid = generateGuid();
      expect(typeof guid).toBe('bigint');
      expect(guid).not.toBe(0n);
    });

    it('should generate unique GUIDs', () => {
      const guid1 = generateGuid();
      const guid2 = generateGuid();
      expect(guid1).not.toBe(guid2);
    });
  });

  describe('generateUniqueGuid', () => {
    it('should generate a unique GUID with timestamp', () => {
      const guid = generateUniqueGuid();
      expect(typeof guid).toBe('bigint');
      expect(guid > 0n).toBe(true);
    });

    it('should generate different GUIDs on subsequent calls', () => {
      const guid1 = generateUniqueGuid();
      const guid2 = generateUniqueGuid();
      expect(guid1).not.toBe(guid2);
    });
  });

  describe('ankiTime', () => {
    it('should return current timestamp in seconds', () => {
      const now = Date.now();
      const ankiTimestamp = ankiTime();
      const expectedTimestamp = Math.floor(now / 1000);

      expect(ankiTimestamp).toBeCloseTo(expectedTimestamp, -1);
      expect(typeof ankiTimestamp).toBe('number');
    });
  });

  describe('joinFields', () => {
    it('should join fields with field separator', () => {
      const fields = ['Front', 'Back', 'Extra'];
      const result = joinFields(fields);
      expect(result).toBe('Front\x1fBack\x1fExtra');
    });

    it('should handle empty array', () => {
      const result = joinFields([]);
      expect(result).toBe('');
    });

    it('should handle single field', () => {
      const result = joinFields(['Single']);
      expect(result).toBe('Single');
    });
  });

  describe('formatTags', () => {
    it('should format tags with spaces', () => {
      const tags = ['tag1', 'tag2', 'tag3'];
      const result = formatTags(tags);
      expect(result).toBe(' tag1 tag2 tag3 ');
    });

    it('should handle empty tags', () => {
      const result = formatTags([]);
      expect(result).toBe('');
    });
  });

  describe('generateDeckId', () => {
    it('should generate a valid deck ID', () => {
      const deckId = generateDeckId();
      expect(typeof deckId).toBe('number');
      expect(deckId).toBeGreaterThan(1000000000);
    });
  });

  describe('generateModelId', () => {
    it('should generate a valid model ID', () => {
      const modelId = generateModelId();
      expect(typeof modelId).toBe('number');
      expect(modelId).toBeGreaterThan(0);
    });
  });
});
