// tests/integration.test.ts
import { describe, it, expect } from 'vitest';
import { Package, Deck, Note, Model, builtin } from '../index.js';

describe('Integration Tests', () => {
  describe('Basic workflow', () => {
    it('should create a complete package with builtin model', async () => {
      // Create a deck
      const deck = new Deck({
        name: 'Spanish Vocabulary',
        description: 'Learning Spanish words',
      });

      // Create notes using builtin model
      const notes = [
        new Note({
          modelId: builtin.BASIC_MODEL.modelId,
          fields: ['Hola', 'Hello'],
          tags: ['spanish', 'greeting'],
        }),
        new Note({
          modelId: builtin.BASIC_MODEL.modelId,
          fields: ['Gracias', 'Thank you'],
          tags: ['spanish', 'polite'],
        }),
        new Note({
          modelId: builtin.BASIC_MODEL.modelId,
          fields: ['Adiós', 'Goodbye'],
          tags: ['spanish', 'farewell'],
        }),
      ];

      // Add notes to deck
      deck.addNotes(notes, builtin.BASIC_MODEL);

      // Create package
      const pkg = new Package();
      pkg.addDeck(deck);
      pkg.addModel(builtin.BASIC_MODEL);

      // Verify structure
      expect(deck.getNoteCount()).toBe(3);
      expect(deck.getCardCount()).toBe(3);
      expect(pkg.decks).toHaveLength(1);
      expect(pkg.models).toHaveLength(1);

      // Generate package
      const buffer = await pkg.writeToBuffer();
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should create a package with custom model', async () => {
      // Create custom model
      const customModel = new Model({
        name: 'Language Learning',
        fields: [
          { name: 'Word' },
          { name: 'Translation' },
          { name: 'Example' },
          { name: 'Audio' },
        ],
        templates: [
          {
            name: 'Recognition',
            qfmt: '{{Word}}<br><small>{{Example}}</small>',
            afmt: '{{FrontSide}}<hr>{{Translation}}<br>{{Audio}}',
          },
          {
            name: 'Production',
            qfmt: '{{Translation}}',
            afmt: '{{FrontSide}}<hr>{{Word}}<br>{{Example}}<br>{{Audio}}',
          },
        ],
      });

      // Create deck with custom model
      const deck = new Deck({ name: 'Advanced Spanish' });

      const note = new Note({
        modelId: customModel.modelId,
        fields: [
          'embarazada',
          'pregnant',
          'Mi hermana está embarazada.',
          '[sound:embarazada.mp3]',
        ],
        tags: ['spanish', 'advanced', 'family'],
      });

      deck.addNote(note, customModel);

      // Create package
      const pkg = new Package();
      pkg.addDeck(deck);
      pkg.addModel(customModel);

      // Add media file
      pkg.addMedia({
        name: 'embarazada.mp3',
        data: Buffer.from('fake-audio-data'),
      });

      // Verify
      expect(deck.getCardCount()).toBe(2); // Two templates = two cards
      expect(pkg.media).toHaveLength(1);

      const buffer = await pkg.writeToBuffer();
      expect(buffer).toBeInstanceOf(Buffer);
    });
  });

  describe('Cloze deletions', () => {
    it('should work with cloze model', async () => {
      const deck = new Deck({ name: 'Cloze Test' });

      const clozeNote = new Note({
        modelId: builtin.CLOZE_MODEL.modelId,
        fields: [
          'The capital of {{c1::France}} is {{c2::Paris}}.',
          'Geography facts',
        ],
        tags: ['geography', 'cloze'],
      });

      deck.addNote(clozeNote, builtin.CLOZE_MODEL);

      const pkg = new Package();
      pkg.addDeck(deck);
      pkg.addModel(builtin.CLOZE_MODEL);

      expect(deck.getNoteCount()).toBe(1);
      expect(deck.getCardCount()).toBe(1); // Cloze model creates one card

      const buffer = await pkg.writeToBuffer();
      expect(buffer).toBeInstanceOf(Buffer);
    });
  });

  describe('Multiple decks', () => {
    it('should handle multiple decks in one package', async () => {
      const spanishDeck = new Deck({ name: 'Spanish' });
      const frenchDeck = new Deck({ name: 'French' });

      // Add notes to Spanish deck
      spanishDeck.addNote(
        new Note({
          modelId: builtin.BASIC_MODEL.modelId,
          fields: ['casa', 'house'],
        }),
        builtin.BASIC_MODEL,
      );

      // Add notes to French deck
      frenchDeck.addNote(
        new Note({
          modelId: builtin.BASIC_MODEL.modelId,
          fields: ['maison', 'house'],
        }),
        builtin.BASIC_MODEL,
      );

      const pkg = new Package();
      pkg.addDeck(spanishDeck);
      pkg.addDeck(frenchDeck);
      pkg.addModel(builtin.BASIC_MODEL);

      expect(pkg.decks).toHaveLength(2);
      expect(spanishDeck.getNoteCount()).toBe(1);
      expect(frenchDeck.getNoteCount()).toBe(1);

      const buffer = await pkg.writeToBuffer();
      expect(buffer).toBeInstanceOf(Buffer);
    });
  });
});
