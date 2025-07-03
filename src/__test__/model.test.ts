// tests/model.test.ts
import { describe, it, expect } from 'vitest';
import { Model } from '../model.js';

describe('Model', () => {
  const mockModelConfig = {
    modelId: 1607392319,
    name: 'Test Model',
    fields: [{ name: 'Front' }, { name: 'Back' }],
    templates: [
      {
        name: 'Card 1',
        qfmt: '{{Front}}',
        afmt: '{{FrontSide}}<hr id="answer">{{Back}}',
      },
    ],
  };

  describe('constructor', () => {
    it('should create a model with provided configuration', () => {
      const model = new Model(mockModelConfig);

      expect(model.modelId).toBe(1607392319);
      expect(model.name).toBe('Test Model');
      expect(model.fields).toHaveLength(2);
      expect(model.templates).toHaveLength(1);
      expect(model.type).toBe(0); // Default standard type
    });

    it('should create a model with defaults', () => {
      const model = new Model({
        name: 'Minimal Model',
        fields: [{ name: 'Field1' }],
        templates: [
          {
            name: 'Template1',
            qfmt: '{{Field1}}',
            afmt: '{{Field1}}',
          },
        ],
      });

      expect(typeof model.modelId).toBe('number');
      expect(model.name).toBe('Minimal Model');
      expect(model.css).toContain('font-family: arial');
      expect(model.type).toBe(0);
      expect(model.tags).toEqual([]);
    });

    it('should process fields with defaults', () => {
      const model = new Model(mockModelConfig);

      expect(model.fields[0]).toEqual({
        name: 'Front',
        font: 'Arial',
        size: 20,
        sticky: false,
        rtl: false,
        ord: 0,
      });
    });

    it('should process templates with defaults', () => {
      const model = new Model(mockModelConfig);

      expect(model.templates[0]).toEqual({
        name: 'Card 1',
        qfmt: '{{Front}}',
        afmt: '{{FrontSide}}<hr id="answer">{{Back}}',
        bqfmt: '',
        bafmt: '',
        did: undefined,
        bfont: '',
        bsize: 0,
        ord: 0,
      });
    });

    it('should accept custom CSS', () => {
      const customCss = '.card { background: red; }';
      const model = new Model({
        ...mockModelConfig,
        css: customCss,
      });

      expect(model.css).toBe(customCss);
    });

    it('should accept cloze type', () => {
      const model = new Model({
        ...mockModelConfig,
        type: 1, // Cloze type
      });

      expect(model.type).toBe(1);
    });
  });

  describe('toJson', () => {
    it('should generate valid JSON representation', () => {
      const model = new Model(mockModelConfig);
      const jsonStr = model.toJson();
      const parsed = JSON.parse(jsonStr);

      expect(parsed.id).toBe(1607392319);
      expect(parsed.name).toBe('Test Model');
      expect(parsed.flds).toHaveLength(2);
      expect(parsed.tmpls).toHaveLength(1);
      expect(parsed.type).toBe(0);
      expect(typeof parsed.mod).toBe('number');
      expect(parsed.usn).toBe(-1);
    });

    it('should include field properties in JSON', () => {
      const model = new Model(mockModelConfig);
      const parsed = JSON.parse(model.toJson());

      expect(parsed.flds[0]).toEqual({
        font: 'Arial',
        media: [],
        name: 'Front',
        ord: 0,
        rtl: false,
        size: 20,
        sticky: false,
      });
    });

    it('should include template properties in JSON', () => {
      const model = new Model(mockModelConfig);
      const parsed = JSON.parse(model.toJson());

      expect(parsed.tmpls[0]).toEqual({
        afmt: '{{FrontSide}}<hr id="answer">{{Back}}',
        bafmt: '',
        bfont: '',
        bqfmt: '',
        bsize: 0,
        did: undefined,
        name: 'Card 1',
        ord: 0,
        qfmt: '{{Front}}',
      });
    });
  });
});
