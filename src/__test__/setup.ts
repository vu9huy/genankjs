import { vi } from 'vitest';

// Mock fs operations for testing
vi.mock('fs', () => ({
  writeFileSync: vi.fn(),
  unlinkSync: vi.fn(),
  readFileSync: vi.fn().mockReturnValue(Buffer.from('mock-db-data')),
}));

vi.mock('better-sqlite3', () => {
  const mockDb = {
    exec: vi.fn(),
    prepare: vi.fn().mockReturnValue({
      run: vi.fn(),
    }),
    close: vi.fn(),
  };
  return { default: vi.fn().mockReturnValue(mockDb) };
});

vi.mock('jszip', () => ({
  default: vi.fn().mockImplementation(() => ({
    file: vi.fn(),
    generateAsync: vi.fn().mockResolvedValue(Buffer.from('mock-zip-data')),
  })),
}));
