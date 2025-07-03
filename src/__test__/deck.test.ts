// tests/deck.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { Deck } from '../deck.js';
import { Note } from '../note.js';
import { Model } from '../model.js';

describe('Deck', () => {
  const mockDeckConfig = {
    deckId: 987654321,
    name: 'Test Deck',
    description: 'A test deck',
  };

  describe('constructor', () => {
    it('should create a deck with provided configuration', () => {
      const deck = new Deck(mockDeckConfig);

      expect(deck.deckId).toBe(987654321);
      expect(deck.name).toBe('Test Deck');
      expect(deck.description).toBe('A test deck');
      expect(deck.notes).toEqual([]);
      expect(deck.cards).toEqual([]);
    });

    it('should create a deck with minimal configuration', () => {
      const deck = new Deck({ name: 'Minimal Deck' });

      expect(typeof deck.deckId).toBe('number');
      expect(deck.name).toBe('Minimal Deck');
      expect(deck.description).toBe('');
    });
  });

  describe('addNote', () => {
    let deck: Deck;
    let note: Note;
    let model: Model;

    beforeEach(() => {
      deck = new Deck(mockDeckConfig);
      note = new Note({
        modelId: 123,
        fields: ['Front', 'Back'],
      });
      model = new Model({
        modelId: 123,
        name: 'Basic',
        fields: [{ name: 'Front' }, { name: 'Back' }],
        templates: [
          {
            name: 'Card 1',
            qfmt: '{{Front}}',
            afmt: '{{Back}}',
          },
        ],
      });
    });

    it('should add a note to the deck', () => {
      deck.addNote(note);

      expect(deck.notes).toHaveLength(1);
      expect(deck.notes[0]).toBe(note);
    });

    it('should create cards when model is provided', () => {
      deck.addNote(note, model);

      expect(deck.notes).toHaveLength(1);
      expect(deck.cards).toHaveLength(1);
      expect(deck.cards[0]?.deckId).toBe(deck.deckId);
      expect(deck.cards[0]?.ord).toBe(0);
    });

    it('should create multiple cards for multi-template model', () => {
      const multiTemplateModel = new Model({
        modelId: 123,
        name: 'Basic + Reverse',
        fields: [{ name: 'Front' }, { name: 'Back' }],
        templates: [
          {
            name: 'Forward',
            qfmt: '{{Front}}',
            afmt: '{{Back}}',
          },
          {
            name: 'Reverse',
            qfmt: '{{Back}}',
            afmt: '{{Front}}',
          },
        ],
      });

      deck.addNote(note, multiTemplateModel);

      expect(deck.cards).toHaveLength(2);
      expect(deck.cards[0]?.ord).toBe(0);
      expect(deck.cards[1]?.ord).toBe(1);
    });

    it('should create one card when no model is provided', () => {
      deck.addNote(note);

      expect(deck.cards).toHaveLength(1);
      expect(deck.cards[0]?.ord).toBe(0);
    });

    it('should assign incremental due positions', () => {
      const note1 = new Note({ fields: ['Front1', 'Back1'] });
      const note2 = new Note({ fields: ['Front2', 'Back2'] });

      deck.addNote(note1);
      deck.addNote(note2);

      expect(deck.cards[0]?.due).toBe(1);
      expect(deck.cards[1]?.due).toBe(2);
    });
  });

  describe('addNotes', () => {
    it('should add multiple notes', () => {
      const deck = new Deck(mockDeckConfig);
      const notes = [
        new Note({ fields: ['Front1', 'Back1'] }),
        new Note({ fields: ['Front2', 'Back2'] }),
        new Note({ fields: ['Front3', 'Back3'] }),
      ];

      deck.addNotes(notes);

      expect(deck.notes).toHaveLength(3);
      expect(deck.cards).toHaveLength(3);
    });
  });

  describe('count methods', () => {
    let deck: Deck;

    beforeEach(() => {
      deck = new Deck(mockDeckConfig);
      const notes = [
        new Note({ fields: ['Front1', 'Back1'] }),
        new Note({ fields: ['Front2', 'Back2'] }),
      ];
      deck.addNotes(notes);
    });

    it('should return correct note count', () => {
      expect(deck.getNoteCount()).toBe(2);
    });

    it('should return correct card count', () => {
      expect(deck.getCardCount()).toBe(2);
    });
  });

  describe('toJson', () => {
    it('should generate valid JSON representation', () => {
      const deck = new Deck(mockDeckConfig);
      const jsonStr = deck.toJson();
      const parsed = JSON.parse(jsonStr);

      expect(parsed.id).toBe(987654321);
      expect(parsed.name).toBe('Test Deck');
      expect(parsed.desc).toBe('A test deck');
      expect(typeof parsed.mod).toBe('number');
      expect(parsed.usn).toBe(-1);
      expect(parsed.dyn).toBe(0);
    });
  });
});
