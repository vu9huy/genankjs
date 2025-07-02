import type { DeckConfig } from './types.js';
import type { Note } from './note.js';
import type { Model } from './model.js';
import { Card } from './card.js';
import { generateDeckId, ankiTime } from './utils.js';

export class Deck {
  public deckId: number;
  public name: string;
  public description: string;
  public notes: Note[];
  public cards: Card[];

  constructor(config: DeckConfig) {
    this.deckId = config.deckId ?? generateDeckId();
    this.name = config.name;
    this.description = config.description ?? '';
    this.notes = [];
    this.cards = [];
  }

  /**
   * Add a note to the deck
   */
  addNote(note: Note, model?: Model): void {
    this.notes.push(note);
    
    // Get the note ID that will be used in the database
    const noteValues = note.toSqlValues();
    const noteId = noteValues.id.toString();
    
    // Calculate due position for new cards (incremental)
    const duePosition = this.cards.length + 1;
    
    // Generate cards for each template in the model
    if (model) {
      for (let i = 0; i < model.templates.length; i++) {
        const card = new Card(noteId, this.deckId, i, duePosition + i);
        this.cards.push(card);
      }
    } else {
      // If no model provided, create one card with ordinal 0
      const card = new Card(noteId, this.deckId, 0, duePosition);
      this.cards.push(card);
    }
  }

  /**
   * Add multiple notes to the deck
   */
  addNotes(notes: Note[], model?: Model): void {
    for (const note of notes) {
      this.addNote(note, model);
    }
  }

  /**
   * Get the number of notes in the deck
   */
  getNoteCount(): number {
    return this.notes.length;
  }

  /**
   * Get the number of cards in the deck
   */
  getCardCount(): number {
    return this.cards.length;
  }

  /**
   * Generate the JSON representation for the Anki collection
   */
  toJson(): string {
    const deckData = {
      id: this.deckId,
      name: this.name,
      desc: this.description,
      mod: ankiTime(),
      usn: -1,
      collapsed: false,
      newToday: [0, 0],
      revToday: [0, 0],
      lrnToday: [0, 0],
      timeToday: [0, 0],
      dyn: 0, // 0 = regular deck, 1 = filtered deck
      extendNew: 10,
      extendRev: 50,
      conf: 1, // Deck config ID
    };

    return JSON.stringify(deckData);
  }
}