// tests/builtin.test.ts
import { describe, it, expect } from 'vitest';
import { builtin } from '../builtin.js';

describe('Builtin Models', () => {
  describe('BASIC_MODEL', () => {
    it('should have correct configuration', () => {
      const model = builtin.BASIC_MODEL;

      expect(model.modelId).toBe(1607392319);
      expect(model.name).toBe('Basic');
      expect(model.fields).toHaveLength(2);
      expect(model.fields[0]?.name).toBe('Front');
      expect(model.fields[1]?.name).toBe('Back');
      expect(model.templates).toHaveLength(1);
      expect(model.templates[0]?.name).toBe('Card 1');
    });
  });

  describe('BASIC_AND_REVERSED_CARD_MODEL', () => {
    it('should have two templates', () => {
      const model = builtin.BASIC_AND_REVERSED_CARD_MODEL;

      expect(model.templates).toHaveLength(2);
      expect(model.templates[0]?.qfmt).toBe('{{Front}}');
      expect(model.templates[1]?.qfmt).toBe('{{Back}}');
    });
  });

  describe('BASIC_OPTIONAL_REVERSED_CARD_MODEL', () => {
    it('should have Add Reverse field', () => {
      const model = builtin.BASIC_OPTIONAL_REVERSED_CARD_MODEL;

      expect(model.fields).toHaveLength(3);
      expect(model.fields[2]?.name).toBe('Add Reverse');
      expect(model.templates[1]?.qfmt).toBe(
        '{{#Add Reverse}}{{Back}}{{/Add Reverse}}',
      );
    });
  });

  describe('CLOZE_MODEL', () => {
    it('should be cloze type', () => {
      const model = builtin.CLOZE_MODEL;

      expect(model.type).toBe(1);
      expect(model.templates[0]?.qfmt).toBe('{{cloze:Text}}');
    });
  });

  describe('BASIC_TYPE_IN_THE_ANSWER_MODEL', () => {
    it('should have type directive in question format', () => {
      const model = builtin.BASIC_TYPE_IN_THE_ANSWER_MODEL;

      expect(model.templates[0]?.qfmt).toBe('{{Front}}<br>{{type:Back}}');
    });
  });

  describe('IMAGE_OCCLUSION_MODEL', () => {
    it('should have image occlusion fields', () => {
      const model = builtin.IMAGE_OCCLUSION_MODEL;

      expect(model.fields).toHaveLength(4);
      expect(model.fields[0]?.name).toBe('Image');
      expect(model.fields[1]?.name).toBe('Question');
      expect(model.fields[2]?.name).toBe('Answer');
      expect(model.fields[3]?.name).toBe('Remarks');
    });
  });
});
