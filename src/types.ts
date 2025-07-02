export interface Field {
  name: string;
  font?: string;
  size?: number;
  sticky?: boolean;
  rtl?: boolean;
  ord?: number;
}

export interface Template {
  name: string;
  qfmt: string; // Question format
  afmt: string; // Answer format
  bqfmt?: string; // Browser question format
  bafmt?: string; // Browser answer format
  did?: number; // Deck id
  bfont?: string; // Browser font
  bsize?: number; // Browser font size
  ord?: number; // Ordinal
}

export interface ModelConfig {
  modelId?: number;
  name: string;
  fields: Field[];
  templates: Template[];
  css?: string;
  latexPre?: string;
  latexPost?: string;
  type?: number; // 0 = standard, 1 = cloze
  tags?: string[];
}

export interface MediaFile {
  name: string;
  data: Buffer | Uint8Array;
}

export interface NoteConfig {
  modelId?: number;
  fields: string[];
  tags?: string[];
  guid?: string;
}

export interface DeckConfig {
  deckId?: number;
  name: string;
  description?: string;
}

export interface PackageConfig {
  media?: MediaFile[];
}
