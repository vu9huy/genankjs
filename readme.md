# GenAnki.js

[![npm version](https://badge.fury.io/js/genankjs.svg)](https://badge.fury.io/js/genankjs)
[![downloads](https://img.shields.io/npm/dt/genankjs.svg)](https://www.npmjs.com/package/genankjs)
[![license](https://img.shields.io/npm/l/genankjs.svg)](https://github.com/your-username/genankjs/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> A powerful TypeScript library for generating Anki flashcard packages (.apkg files) programmatically, inspired by the Python [genanki](https://github.com/kerrickstaley/genanki) library.

## ✨ Features

- 🃏 **Create Anki packages** - Generate .apkg files programmatically
- 🎵 **Rich media support** - Audio files (.mp3, .wav, etc.)
- 🖼️ **Image support** - Images (.jpg, .png, .gif, etc.)
- 📝 **Built-in templates** - Basic, Cloze, Image Occlusion, and more
- 🎨 **Custom styling** - Full CSS customization support
- 📚 **Multiple decks** - Organize cards into different decks
- 🏷️ **Tagging system** - Organize and categorize your cards
- 💪 **TypeScript first** - Full type safety and IntelliSense support
- 🧪 **Well tested** - Comprehensive test coverage

## 📦 Installation

```bash
npm install genankjs
```

## 🚀 Quick Start

```typescript
import { Package, Deck, Note, builtin } from 'genankjs';

// Create a new package
const pkg = new Package();

// Create a deck
const deck = new Deck({
  name: 'Spanish Vocabulary',
  description: 'Basic Spanish words and phrases'
});

// Create notes with the basic model
const notes = [
  new Note({
    modelId: builtin.BASIC_MODEL.modelId,
    fields: ['Hola', 'Hello'],
    tags: ['spanish', 'greetings']
  }),
  new Note({
    modelId: builtin.BASIC_MODEL.modelId,
    fields: ['Gracias', 'Thank you'],
    tags: ['spanish', 'politeness']
  })
];

// Add notes to deck
deck.addNotes(notes, builtin.BASIC_MODEL);

// Add deck and model to package
pkg.addDeck(deck);
pkg.addModel(builtin.BASIC_MODEL);

// Generate the .apkg file
await pkg.writeToFile('spanish.apkg');
console.log('✅ Package created successfully!');
```

## 📚 Table of Contents

- [Core Classes](#-core-classes)
- [Built-in Models](#-built-in-models)
- [Media Support](#-media-support)
- [Advanced Examples](#-advanced-examples)
- [API Reference](#-api-reference)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)

## 🏗️ Core Classes

### Package

The main container for creating .apkg files.

```typescript
import { Package } from 'genankjs';

const pkg = new Package({
  media: [] // Optional: array of media files
});

// Add decks and models
pkg.addDeck(deck);
pkg.addModel(model);

// Add media files
pkg.addMedia({
  name: 'audio.mp3',
  data: audioBuffer
});

// Generate package
await pkg.writeToFile('output.apkg');
// or get as buffer
const buffer = await pkg.writeToBuffer();
```

### Deck

Represents a collection of flashcards.

```typescript
import { Deck } from 'genankjs';

const deck = new Deck({
  name: 'My Deck',
  description: 'Optional description',
  deckId: 123456789 // Optional: custom ID
});

// Add notes
deck.addNote(note, model); // model is optional
deck.addNotes([note1, note2], model);

// Get statistics
console.log(`Notes: ${deck.getNoteCount()}`);
console.log(`Cards: ${deck.getCardCount()}`);
```

### Note

Represents a single flashcard note.

```typescript
import { Note } from 'genankjs';

const note = new Note({
  modelId: model.modelId,
  fields: ['Front content', 'Back content'],
  tags: ['tag1', 'tag2'],
  guid: 'optional-custom-guid'
});

// Manipulate fields
note.setField(0, 'New front content');
console.log(note.getField(0));

// Manage tags
note.addTag('new-tag');
note.removeTag('old-tag');
```

### Model

Defines the structure and appearance of cards.

```typescript
import { Model } from 'genankjs';

const model = new Model({
  name: 'Custom Model',
  fields: [
    { name: 'Question' },
    { name: 'Answer' },
    { name: 'Hint' }
  ],
  templates: [{
    name: 'Card 1',
    qfmt: '{{Question}}<br><small>{{Hint}}</small>',
    afmt: '{{FrontSide}}<hr id="answer">{{Answer}}'
  }],
  css: `
    .card {
      font-family: Arial;
      font-size: 20px;
      text-align: center;
      color: black;
      background-color: white;
    }
  `
});
```

## 🎯 Built-in Models

The library includes several pre-defined models similar to Anki's built-in note types:

| Model | Description | Use Case |
|-------|-------------|----------|
| `BASIC_MODEL` | Simple front/back cards | Basic vocabulary, definitions |
| `BASIC_AND_REVERSED_CARD_MODEL` | Creates both directions automatically | Language learning |
| `BASIC_OPTIONAL_REVERSED_CARD_MODEL` | Optional reverse cards | Flexible vocabulary |
| `BASIC_TYPE_IN_THE_ANSWER_MODEL` | Requires typing the answer | Active recall practice |
| `CLOZE_MODEL` | Fill-in-the-blank cards | Context-based learning |
| `IMAGE_OCCLUSION_MODEL` | Hide parts of images | Visual learning |

### Example Usage

```typescript
import { builtin } from 'genankjs';

// Basic cards
const basicNote = new Note({
  modelId: builtin.BASIC_MODEL.modelId,
  fields: ['What is the capital of France?', 'Paris']
});

// Cloze deletion
const clozeNote = new Note({
  modelId: builtin.CLOZE_MODEL.modelId,
  fields: [
    'The capital of {{c1::France}} is {{c2::Paris}}.',
    'Geography fact'
  ]
});

// Add to deck
deck.addNote(basicNote, builtin.BASIC_MODEL);
deck.addNote(clozeNote, builtin.CLOZE_MODEL);

// Don't forget to add models to package
pkg.addModel(builtin.BASIC_MODEL);
pkg.addModel(builtin.CLOZE_MODEL);
```

## 🎵 Media Support

Add audio, images, and other media files to your cards:

```typescript
import { readFileSync } from 'fs';

// Read media files
const audioData = readFileSync('pronunciation.mp3');
const imageData = readFileSync('diagram.jpg');

// Add to package
pkg.addMedia({ name: 'pronunciation.mp3', data: audioData });
pkg.addMedia({ name: 'diagram.jpg', data: imageData });

// Reference in cards (media files are numbered starting from 0)
const note = new Note({
  modelId: builtin.BASIC_MODEL.modelId,
  fields: [
    'How do you pronounce "bonjour"? [sound:0]',
    'Bonjour <img src="1" style="max-width: 200px;">'
  ]
});
```

### Supported Media Types

- **Audio**: .mp3, .wav, .ogg, .flac
- **Images**: .jpg, .png, .gif, .webp, .svg
- **Video**: .mp4, .webm (limited support)

## 🎨 Advanced Examples

### Custom Model with Multiple Templates

```typescript
const languageModel = new Model({
  name: 'Language Learning',
  fields: [
    { name: 'Word' },
    { name: 'Translation' },
    { name: 'Example' },
    { name: 'Audio' }
  ],
  templates: [
    {
      name: 'Recognition',
      qfmt: '{{Word}}<br>{{Audio}}',
      afmt: '{{FrontSide}}<hr id="answer">{{Translation}}<br><em>{{Example}}</em>'
    },
    {
      name: 'Production',
      qfmt: '{{Translation}}',
      afmt: '{{FrontSide}}<hr id="answer">{{Word}}<br>{{Audio}}<br><em>{{Example}}</em>'
    }
  ],
  css: `
    .card {
      font-family: 'Segoe UI', sans-serif;
      font-size: 18px;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
    }
    .example { font-style: italic; color: #ccc; }
  `
});
```

### Conditional Templates

```typescript
// Card will only be generated if "Add Reverse" field is not empty
const template = {
  name: 'Reverse Card',
  qfmt: '{{#Add Reverse}}{{Back}}{{/Add Reverse}}',
  afmt: '{{FrontSide}}<hr id="answer">{{Front}}'
};
```

### Bulk Import from CSV

```typescript
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

// Read CSV file
const csvData = readFileSync('vocabulary.csv', 'utf8');
const records = parse(csvData, { columns: true });

// Create notes from CSV
const notes = records.map(record => new Note({
  modelId: builtin.BASIC_MODEL.modelId,
  fields: [record.word, record.translation],
  tags: record.tags?.split(',') || []
}));

// Add all notes to deck
deck.addNotes(notes, builtin.BASIC_MODEL);
```

## 📋 API Reference

### Core Types

```typescript
interface Field {
  name: string;
  font?: string;
  size?: number;
  sticky?: boolean;
  rtl?: boolean;
  ord?: number;
}

interface Template {
  name: string;
  qfmt: string;        // Question format
  afmt: string;        // Answer format
  bqfmt?: string;      // Browser question format
  bafmt?: string;      // Browser answer format
}

interface MediaFile {
  name: string;
  data: Buffer | Uint8Array;
}

interface NoteConfig {
  modelId?: number;
  fields: string[];
  tags?: string[];
  guid?: string;
}

interface DeckConfig {
  deckId?: number;
  name: string;
  description?: string;
}
```

### Utility Functions

```typescript
// Generate unique identifiers
import { generateGuid, generateUniqueGuid } from 'genankjs';

const guid = generateGuid();
const uniqueGuid = generateUniqueGuid();
```

## 🛠️ Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test        # Run tests once
npm run dev     # Run tests in watch mode
```

### Formatting

```bash
npm run format       # Format code
npm run check-format # Check formatting
```

## 🐛 Troubleshooting

### Duplicate Detection in Anki

**Problem**: Anki shows "notes already present in your collection" and skips importing cards.

**Why this happens**:
- Anki detects duplicates based on the first field content
- You might already have cards with the same content
- The GUID or checksum matches existing notes

**Solutions**:

1. **Use unique content** (recommended):
```typescript
const note = new Note({
  modelId: builtin.BASIC_MODEL.modelId,
  fields: [`Hello - ${Date.now()}`, 'Hello'],
  tags: ['unique']
});
```

2. **Force unique GUIDs**:
```typescript
import { generateUniqueGuid } from 'genankjs';

const note = new Note({
  modelId: builtin.BASIC_MODEL.modelId,
  fields: ['Hello', 'Hello'],
  guid: generateUniqueGuid().toString()
});
```

3. **Use custom model IDs**:
```typescript
const customModel = new Model({
  modelId: Date.now(), // Unique timestamp-based ID
  name: 'My Custom Model',
  // ... rest of config
});
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid .apkg file" | Ensure all media files are included and field references match |
| Large file sizes | Compress media files before adding |
| Import errors | Use Anki 2.1+ and check error logs |
| Missing cards | Verify model templates and field names |

### Getting Help

- 📖 Check the [examples](examples/) directory
- 🧪 Review test files for usage patterns
- 🐛 Open an issue on GitHub for bugs
- 💡 Request features via GitHub discussions

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Python [genanki](https://github.com/kerrickstaley/genanki) library by Kerrick Staley
- Thanks to the Anki project for comprehensive file format documentation
- Built with TypeScript and modern Node.js practices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">
  <strong>Made with ❤️ for the Anki community</strong>
  <br>
  <sub>If this project helped you, please consider giving it a ⭐️</sub>
</div>