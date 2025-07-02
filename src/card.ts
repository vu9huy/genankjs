import { ankiTime } from './utils.js';

export class Card {
  public id: string;
  public noteId: string;
  public deckId: number;
  public ord: number; // Ordinal (which template)
  public mod: number; // Modified time
  public usn: number; // Update sequence number
  public type: number; // Card type (0=new, 1=learning, 2=due)
  public queue: number; // Queue (0=new, 1=learning, 2=due, -1=suspended)
  public due: number; // Due date
  public ivl: number; // Interval
  public factor: number; // Ease factor
  public reps: number; // Number of repetitions
  public lapses: number; // Number of lapses
  public left: number; // Learning left
  public odue: number; // Original due (when in filtered deck)
  public odid: number; // Original deck id (when in filtered deck)
  public flags: number; // Flags
  public data: string; // User data

  constructor(noteId: string, deckId: number, ord = 0, duePosition = 1) {
    // Generate proper card ID - should be unique integer
    this.id = (Date.now() + Math.floor(Math.random() * 1000000)).toString();
    this.noteId = noteId;
    this.deckId = deckId;
    this.ord = ord;
    this.mod = ankiTime();
    this.usn = -1;
    this.type = 0; // New card
    this.queue = 0; // New queue  
    this.due = duePosition; // Due position for new cards (should be incremental)
    this.ivl = 0; // No interval yet
    this.factor = 0; // No factor yet
    this.reps = 0; // No repetitions yet
    this.lapses = 0; // No lapses yet
    this.left = 0; // No learning steps left
    this.odue = 0; // Not in filtered deck
    this.odid = 0; // Not in filtered deck
    this.flags = 0; // No flags
    this.data = ''; // No user data
  }

  /**
   * Generate SQL values for inserting into cards table
   */
  toSqlValues(): {
    id: number;
    nid: number;
    did: number;
    ord: number;
    mod: number;
    usn: number;
    type: number;
    queue: number;
    due: number;
    ivl: number;
    factor: number;
    reps: number;
    lapses: number;
    left: number;
    odue: number;
    odid: number;
    flags: number;
    data: string;
  } {
    return {
      id: parseInt(this.id),
      nid: parseInt(this.noteId),
      did: this.deckId,
      ord: this.ord,
      mod: this.mod,
      usn: this.usn,
      type: this.type,
      queue: this.queue,
      due: this.due,
      ivl: this.ivl,
      factor: this.factor,
      reps: this.reps,
      lapses: this.lapses,
      left: this.left,
      odue: this.odue,
      odid: this.odid,
      flags: this.flags,
      data: this.data,
    };
  }
}