# GenAnki.js

A TypeScript library for generating Anki flashcard packages (.apkg files) with support for media files, based on the Python [genanki](https://github.com/kerrickstaley/genanki) library.

## Features

- 🃏 Create Anki flashcard packages programmatically
- 🎵 Support for audio files (.mp3, .wav, etc.)
- 🖼️ Support for images (.jpg, .png, .gif, etc.)
- 📝 Multiple built-in card templates (Basic, Cloze, etc.)
- 🎨 Custom card models with CSS styling
- 📚 Multiple decks per package
- 🏷️ Tag support
- 💪 Full TypeScript support
- 🧪 Comprehensive test coverage

## Installation

```bash
npm install genankjs
```

## Quick Start

```typescript
import { Package, Deck, Note, builtin } from 'genankjs';

// Create a new package
const pkg = new Package();

// Create a deck
const deck = new Deck({
  name: 'Spanish Vocabulary',
});

// Create notes
const note = new Note({
  modelId: builtin.BASIC_MODEL.modelId,
  fields: ['Hola', 'Hello'],
  tags: ['spanish', 'greetings'],
});

// Add note to deck
deck.addNote(note, builtin.BASIC_MODEL);

// Add deck and model to package
pkg.addDeck(deck);
pkg.addModel(builtin.BASIC_MODEL);

// Generate the .apkg file
await pkg.writeToFile('spanish.apkg');
```

## Core Classes

### Package

The main container for creating .apkg files.

```typescript
import { Package } from 'genankjs';

const pkg = new Package({
  media: [], // Optional: array of media files
});

// Add decks and models
pkg.addDeck(deck);
pkg.addModel(model);

// Add media files
pkg.addMedia({
  name: 'audio.mp3',
  data: audioBuffer,
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
  deckId: 123456789, // Optional: custom ID
});

// Add notes
deck.addNote(note, model); // model is optional
deck.addNotes([note1, note2], model);

// Get counts
console.log(deck.getNoteCount()); // Number of notes
console.log(deck.getCardCount()); // Number of cards (can be > notes if multiple templates)
```

### Note

Represents a single flashcard note.

```typescript
import { Note } from 'genankjs';

const note = new Note({
  modelId: model.modelId,
  fields: ['Front content', 'Back content'],
  tags: ['tag1', 'tag2'],
  guid: 'optional-custom-guid',
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
  fields: [{ name: 'Question' }, { name: 'Answer' }, { name: 'Hint' }],
  templates: [
    {
      name: 'Card 1',
      qfmt: '{{Question}}<br><small>{{Hint}}</small>',
      afmt: '{{FrontSide}}<hr id="answer">{{Answer}}',
    },
  ],
  css: `
    .card {
      font-family: Arial;
      font-size: 20px;
      text-align: center;
      color: black;
      background-color: white;
    }
  `,
});
```

## Built-in Models

The library includes several pre-defined models similar to Anki's built-in note types:

```typescript
import { builtin } from 'genankjs';

// Basic front/back cards
builtin.BASIC_MODEL;

// Basic with automatic reverse card
builtin.BASIC_AND_REVERSED_CARD_MODEL;

// Basic with optional reverse card
builtin.BASIC_OPTIONAL_REVERSED_CARD_MODEL;

// Basic with typing in the answer
builtin.BASIC_TYPE_IN_THE_ANSWER_MODEL;

// Cloze deletion cards
builtin.CLOZE_MODEL;

// Image occlusion
builtin.IMAGE_OCCLUSION_MODEL;
```

### Using Built-in Models

```typescript
const note = new Note({
  modelId: builtin.BASIC_MODEL.modelId,
  fields: ['What is the capital of France?', 'Paris'],
});

deck.addNote(note, builtin.BASIC_MODEL);
pkg.addModel(builtin.BASIC_MODEL);
```

## Media Support

Add audio, images, and other media files to your cards:

```typescript
import { readFileSync } from 'fs';

// Read media files
const audioData = readFileSync('cat_meow.mp3');
const imageData = readFileSync('cat_photo.jpg');

// Add to package
pkg.addMedia({ name: 'cat_meow.mp3', data: audioData });
pkg.addMedia({ name: 'cat_photo.jpg', data: imageData });

// Reference in cards (media files are numbered starting from 0)
const note = new Note({
  modelId: builtin.BASIC_MODEL.modelId,
  fields: [
    'What sound does a cat make? <audio controls><source src="0">[sound:0]</audio>',
    'Meow <img src="1" style="max-width: 200px;">',
  ],
});
```

## Cloze Deletion Cards

Create fill-in-the-blank style cards:

```typescript
const clozeNote = new Note({
  modelId: builtin.CLOZE_MODEL.modelId,
  fields: ['The capital of {{c1::France}} is {{c2::Paris}}.', 'Geography fact'],
});

deck.addNote(clozeNote, builtin.CLOZE_MODEL);
```

## Multiple Decks

Create packages with multiple decks:

```typescript
const spanishDeck = new Deck({ name: 'Spanish' });
const frenchDeck = new Deck({ name: 'French' });

// Add notes to each deck...

pkg.addDeck(spanishDeck);
pkg.addDeck(frenchDeck);
```

## Advanced Examples

### Custom Model with Multiple Templates

```typescript
const model = new Model({
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
      qfmt: '{{Word}}<br>{{Audio}}',
      afmt: '{{FrontSide}}<hr id="answer">{{Translation}}<br><em>{{Example}}</em>',
    },
    {
      name: 'Production',
      qfmt: '{{Translation}}',
      afmt: '{{FrontSide}}<hr id="answer">{{Word}}<br>{{Audio}}<br><em>{{Example}}</em>',
    },
  ],
});
```

### Conditional Templates

```typescript
// Card will only be generated if "Add Reverse" field is not empty
const template = {
  name: 'Reverse Card',
  qfmt: '{{#Add Reverse}}{{Back}}{{/Add Reverse}}',
  afmt: '{{FrontSide}}<hr id="answer">{{Front}}',
};
```

## API Reference

### Types

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
  qfmt: string; // Question format
  afmt: string; // Answer format
  bqfmt?: string; // Browser question format
  bafmt?: string; // Browser answer format
}

interface MediaFile {
  name: string;
  data: Buffer | Uint8Array;
}
```

## Development

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Based on the Python [genanki](https://github.com/kerrickstaley/genanki) library by Kerrick Staley
- Anki file format documentation from the Anki project

## Troubleshooting

### Duplicate Detection in Anki

If Anki shows "notes already present in your collection" and skips importing cards:

**Why this happens:**

- Anki detects duplicates based on the first field content
- You might already have cards with the same content (e.g., "Hello", "Goodbye")
- The GUID or checksum matches existing notes

**Solutions:**

1. **Use unique content** (recommended):

```bash
npm run fresh-demo  # Creates cards with guaranteed unique content
```

2. **Analyze the duplicate issue**:

```bash
npm run analyze-duplicates  # Shows why duplicates are detected
```

3. **Force unique GUIDs in your code**:

```typescript
import { generateUniqueGuid } from 'genankjs';

const note = new Note({
  modelId: builtin.BASIC_MODEL.modelId,
  fields: ['Your content', 'Your answer'],
  guid: generateUniqueGuid().toString(), // Force unique GUID
});
```

4. **Use custom model IDs**:

```typescript
const customModel = new Model({
  modelId: Date.now(), // Unique timestamp-based ID
  name: 'My Custom Model',
  // ... rest of config
});
```

### Common Issues

**"Invalid .apkg file" in Anki**

- Ensure all referenced media files are included in the package
- Check that model IDs are unique across your package
- Verify that field references in templates match actual field names

**Large file sizes**

- Use appropriate compression for media files before adding them
- Consider splitting large decks into multiple packages

**Import errors**

- Make sure you're using a recent version of Anki (2.1+)
- Check the Anki error logs for specific issues

### Getting Help

- Check the [examples](examples/) directory for complete working examples
- Review the test files for additional usage patterns
- Open an issue on GitHub for bugs or feature requests
