import type { NoteConfig } from './types.js';
import {
  generateUniqueGuid,
  ankiTime,
  joinFields,
  formatTags,
} from './utils.js';

export class Note {
  public modelId: number;
  public fields: string[];
  public tags: string[];
  public guid: bigint;
  public sort: number;

  constructor(config: NoteConfig) {
    this.modelId = config.modelId ?? 0;
    this.fields = [...config.fields];
    this.tags = [...(config.tags ?? '')];
    this.guid = config.guid ? BigInt(config.guid) : generateUniqueGuid();
    this.sort = 0;
  }

  /**
   * Set a specific field value
   */
  setField(index: number, value: string): void {
    if (index >= 0 && index < this.fields.length) {
      this.fields[index] = value;
    } else {
      throw new Error(`Field index ${index} is out of range`);
    }
  }

  /**
   * Get a specific field value
   */
  getField(index: number): string {
    if (index >= 0 && index < this.fields.length) {
      return this.fields[index] ?? '';
    }
    throw new Error(`Field index ${index} is out of range`);
  }

  /**
   * Add a tag to the note
   */
  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  /**
   * Remove a tag from the note
   */
  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
  }

  /**
   * Generate checksum for the note
   */
  checksum(): number {
    const fieldsStr = joinFields(this.fields);
    let sum = 0;
    for (let i = 0; i < fieldsStr.length; i++) {
      sum += fieldsStr.charCodeAt(i);
    }
    return sum;
  }

  /**
   * Generate SQL values for inserting into notes table
   */
  toSqlValues(): {
    id: number;
    guid: string;
    mid: number;
    mod: number;
    usn: number;
    tags: string;
    flds: string;
    sfld: string;
    csum: number;
    flags: number;
    data: string;
  } {
    // Generate a proper integer ID for the note
    const noteId = Date.now() + Math.floor(Math.random() * 1000000);

    return {
      id: noteId,
      guid: this.guid.toString(),
      mid: this.modelId,
      mod: ankiTime(),
      usn: -1,
      tags: formatTags(this.tags),
      flds: joinFields(this.fields),
      sfld: this.fields[0] || '',
      csum: this.checksum(),
      flags: 0,
      data: '',
    };
  }
}
