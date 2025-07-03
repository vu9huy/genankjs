import { describe, it, expect, vi } from 'vitest';
import { Card } from '../card.js';

describe('Card', () => {
  describe('constructor', () => {
    it('should create a card with provided parameters', () => {
      const card = new Card('note123', 456, 1, 5);

      expect(card.noteId).toBe('note123');
      expect(card.deckId).toBe(456);
      expect(card.ord).toBe(1);
      expect(card.due).toBe(5);
      expect(typeof card.id).toBe('string');
      expect(parseInt(card.id)).toBeGreaterThan(0);
    });

    it('should create a card with default parameters', () => {
      const card = new Card('note123', 456);

      expect(card.noteId).toBe('note123');
      expect(card.deckId).toBe(456);
      expect(card.ord).toBe(0);
      expect(card.due).toBe(1);
      expect(card.type).toBe(0); // New card
      expect(card.queue).toBe(0); // New queue
    });

    it('should initialize default card properties', () => {
      const card = new Card('note123', 456);

      expect(card.usn).toBe(-1);
      expect(card.type).toBe(0);
      expect(card.queue).toBe(0);
      expect(card.ivl).toBe(0);
      expect(card.factor).toBe(0);
      expect(card.reps).toBe(0);
      expect(card.lapses).toBe(0);
      expect(card.left).toBe(0);
      expect(card.odue).toBe(0);
      expect(card.odid).toBe(0);
      expect(card.flags).toBe(0);
      expect(card.data).toBe('');
    });
  });

  describe('toSqlValues', () => {
    it('should generate valid SQL values', () => {
      const card = new Card('123', 456, 1, 5);
      const sqlValues = card.toSqlValues();

      expect(typeof sqlValues.id).toBe('number');
      expect(sqlValues.nid).toBe(123); // parsed from noteId
      expect(sqlValues.did).toBe(456);
      expect(sqlValues.ord).toBe(1);
      expect(sqlValues.due).toBe(5);
      expect(typeof sqlValues.mod).toBe('number');
    });

    it('should handle note ID parsing', () => {
      const card = new Card('98765', 456);
      const sqlValues = card.toSqlValues();

      expect(sqlValues.nid).toBe(98765);
    });
  });
});
