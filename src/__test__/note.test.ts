// tests/note.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { Note } from '../note.js';

describe('Note', () => {
  const mockNoteConfig = {
    modelId: 123456,
    fields: ['Front field', 'Back field'],
    tags: ['test', 'sample'],
  };

  describe('constructor', () => {
    it('should create a note with provided configuration', () => {
      const note = new Note(mockNoteConfig);

      expect(note.modelId).toBe(123456);
      expect(note.fields).toEqual(['Front field', 'Back field']);
      expect(note.tags).toEqual(['test', 'sample']);
      expect(typeof note.guid).toBe('bigint');
    });

    it('should create a note with defaults', () => {
      const note = new Note({ fields: ['Test'] });

      expect(note.modelId).toBe(0);
      expect(note.fields).toEqual(['Test']);
      expect(note.tags).toEqual([]);
      expect(typeof note.guid).toBe('bigint');
    });

    it('should accept custom GUID', () => {
      const customGuid = '123456789';
      const note = new Note({
        fields: ['Test'],
        guid: customGuid,
      });

      expect(note.guid).toBe(BigInt(customGuid));
    });

    it('should copy fields array to avoid mutation', () => {
      const originalFields = ['Front', 'Back'];
      const note = new Note({ fields: originalFields });

      note.setField(0, 'Modified');
      expect(originalFields[0]).toBe('Front'); // Original unchanged
      expect(note.getField(0)).toBe('Modified');
    });
  });

  describe('field operations', () => {
    let note: Note;

    beforeEach(() => {
      note = new Note(mockNoteConfig);
    });

    it('should set field value', () => {
      note.setField(0, 'New front');
      expect(note.getField(0)).toBe('New front');
    });

    it('should get field value', () => {
      expect(note.getField(0)).toBe('Front field');
      expect(note.getField(1)).toBe('Back field');
    });

    it('should throw error for invalid field index when setting', () => {
      expect(() => note.setField(-1, 'Invalid')).toThrow(
        'Field index -1 is out of range',
      );
      expect(() => note.setField(5, 'Invalid')).toThrow(
        'Field index 5 is out of range',
      );
    });

    it('should throw error for invalid field index when getting', () => {
      expect(() => note.getField(-1)).toThrow('Field index -1 is out of range');
      expect(() => note.getField(5)).toThrow('Field index 5 is out of range');
    });
  });

  describe('tag operations', () => {
    let note: Note;
    beforeEach(() => {
      note = new Note(mockNoteConfig);
    });
    it('should add tag', () => {
      note.addTag('newTag');
      expect(note.tags).toContain('newTag');
      expect(note.tags).toHaveLength(3);
    });
    it('should not add duplicate tag', () => {
      note.addTag('test'); // Already exists
      const tagsFilter = note.tags.filter((tag) => tag === 'test');
      expect(tagsFilter).toHaveLength(1);
      expect(note.tags).toHaveLength(2);
    });
    it('should remove tag', () => {
      note.removeTag('test');
      expect(note.tags).not.toContain('test');
      expect(note.tags).toHaveLength(1);
    });
    it('should handle removing non-existent tag', () => {
      const originalLength = note.tags.length;
      note.removeTag('nonexistent');
      expect(note.tags).toHaveLength(originalLength);
    });
  });

  describe('checksum', () => {
    it('should generate checksum for fields', () => {
      const note = new Note(mockNoteConfig);
      const checksum = note.checksum();

      expect(typeof checksum).toBe('number');
      expect(checksum).toBeGreaterThan(0);
    });

    it('should generate different checksums for different fields', () => {
      const note1 = new Note({ fields: ['A', 'B'] });
      const note2 = new Note({ fields: ['C', 'D'] });

      expect(note1.checksum()).not.toBe(note2.checksum());
    });

    it('should generate same checksum for same fields', () => {
      const note1 = new Note({ fields: ['Same', 'Fields'] });
      const note2 = new Note({ fields: ['Same', 'Fields'] });

      expect(note1.checksum()).toBe(note2.checksum());
    });
  });

  describe('toSqlValues', () => {
    it('should generate valid SQL values', () => {
      const note = new Note(mockNoteConfig);

      const sqlValues = note.toSqlValues();

      expect(typeof sqlValues.id).toBe('number');
      expect(sqlValues.guid).toBe(note.guid.toString());
      expect(sqlValues.mid).toBe(123456);
      expect(typeof sqlValues.mod).toBe('number');
      expect(sqlValues.usn).toBe(-1);
      expect(sqlValues.tags).toBe(' test sample ');
      expect(sqlValues.flds).toBe('Front field\x1fBack field');
      expect(sqlValues.sfld).toBe('Front field');
      expect(typeof sqlValues.csum).toBe('number');
      expect(sqlValues.flags).toBe(0);
      expect(sqlValues.data).toBe('');
    });

    it('should handle empty first field', () => {
      const note = new Note({ fields: ['', 'Back'] });
      const sqlValues = note.toSqlValues();

      expect(sqlValues.sfld).toBe('');
    });
  });
});
