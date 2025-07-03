// tests/package.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Package } from '../package.js';
import { Deck } from '../deck.js';
import { Note } from '../note.js';
import { Model } from '../model.js';

vi.mock('fs');

describe('Package', () => {
  let pkg: Package;
  let deck: Deck;
  let model: Model;
  let note: Note;

  beforeEach(() => {
    pkg = new Package();

    model = new Model({
      modelId: 123456,
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

    note = new Note({
      modelId: 123456,
      fields: ['Hello', 'World'],
    });

    deck = new Deck({
      name: 'Test Deck',
    });

    deck.addNote(note, model);
  });

  describe('constructor', () => {
    it('should create an empty package', () => {
      const emptyPkg = new Package();

      expect(emptyPkg.decks).toEqual([]);
      expect(emptyPkg.models).toEqual([]);
      expect(emptyPkg.media).toEqual([]);
    });

    it('should create a package with media', () => {
      const media = [
        {
          name: 'image.jpg',
          data: Buffer.from('fake-image-data'),
        },
      ];

      const pkgWithMedia = new Package({ media });

      expect(pkgWithMedia.media).toEqual(media);
    });
  });

  describe('addDeck', () => {
    it('should add a deck to the package', () => {
      pkg.addDeck(deck);

      expect(pkg.decks).toHaveLength(1);
      expect(pkg.decks[0]).toBe(deck);
    });
  });

  describe('addModel', () => {
    it('should add a model to the package', () => {
      pkg.addModel(model);

      expect(pkg.models).toHaveLength(1);
      expect(pkg.models[0]).toBe(model);
    });
  });

  describe('addMedia', () => {
    it('should add a media file', () => {
      const mediaFile = {
        name: 'test.jpg',
        data: Buffer.from('test-data'),
      };

      pkg.addMedia(mediaFile);

      expect(pkg.media).toHaveLength(1);
      expect(pkg.media[0]).toBe(mediaFile);
    });
  });

  describe('addMediaFiles', () => {
    it('should add multiple media files', () => {
      const mediaFiles = [
        { name: 'image1.jpg', data: Buffer.from('data1') },
        { name: 'image2.jpg', data: Buffer.from('data2') },
      ];

      pkg.addMediaFiles(mediaFiles);

      expect(pkg.media).toHaveLength(2);
    });
  });

  describe('writeToBuffer', () => {
    it('should create a buffer with package data', async () => {
      pkg.addDeck(deck);
      pkg.addModel(model);

      const buffer = await pkg.writeToBuffer();

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should handle media files', async () => {
      pkg.addDeck(deck);
      pkg.addModel(model);
      pkg.addMedia({
        name: 'test.jpg',
        data: Buffer.from('image-data'),
      });

      const buffer = await pkg.writeToBuffer();

      expect(buffer).toBeInstanceOf(Buffer);
    });
  });

  describe('writeToFile', () => {
    it('should write package to file', async () => {
      const mockWriteFileSync = vi.mocked(await import('fs')).writeFileSync;

      pkg.addDeck(deck);
      pkg.addModel(model);

      await pkg.writeToFile('test.apkg');

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'test.apkg',
        expect.any(Buffer),
      );
    });
  });
});
