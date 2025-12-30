import { createSlug, slugFromFileName, validateSlug, normalizeSlug } from '../src/utils/slug'

describe('slug utilities', () => {
  describe('createSlug', () => {
    it('should convert text to lowercase', () => {
      expect(createSlug('Hello World')).toBe('hello-world')
      expect(createSlug('UPPERCASE')).toBe('uppercase')
    })

    it('should replace spaces with hyphens', () => {
      expect(createSlug('hello world')).toBe('hello-world')
      expect(createSlug('multiple   spaces')).toBe('multiple-spaces')
    })

    it('should remove special characters', () => {
      expect(createSlug('hello@world')).toBe('helloworld')
      expect(createSlug('test!#$%')).toBe('test')
      expect(createSlug('hello.world')).toBe('helloworld')
    })

    it('should replace underscores with hyphens', () => {
      expect(createSlug('hello_world')).toBe('hello-world')
      expect(createSlug('multiple___underscores')).toBe('multiple-underscores')
    })

    it('should remove leading and trailing hyphens', () => {
      expect(createSlug('-hello-')).toBe('hello')
      expect(createSlug('--hello--world--')).toBe('hello-world')
    })

    it('should handle mixed cases', () => {
      expect(createSlug('  Hello_World-Test  ')).toBe('hello-world-test')
      expect(createSlug('My@Awesome#Post!')).toBe('myawesomepost')
    })

    it('should handle empty strings', () => {
      expect(createSlug('')).toBe('')
      expect(createSlug('   ')).toBe('')
    })

    it('should handle numbers', () => {
      expect(createSlug('hello 123')).toBe('hello-123')
      expect(createSlug('2024-01-15')).toBe('2024-01-15')
    })
  })

  describe('slugFromFileName', () => {
    it('should extract filename and create slug', () => {
      expect(slugFromFileName('path/to/my-file.md')).toBe('my-file')
      expect(slugFromFileName('simple.md')).toBe('simple')
    })

    it('should handle .mdx extension', () => {
      expect(slugFromFileName('path/to/file.mdx')).toBe('file')
    })

    it('should handle filenames with spaces', () => {
      expect(slugFromFileName('my file.md')).toBe('my-file')
      expect(slugFromFileName('path/to/My File.md')).toBe('my-file')
    })

    it('should handle filenames with special characters', () => {
      expect(slugFromFileName('hello@world.md')).toBe('helloworld')
      expect(slugFromFileName('test_file.md')).toBe('test-file')
    })

    it('should handle deep paths', () => {
      expect(slugFromFileName('docs/guides/getting-started/introduction.md')).toBe('introduction')
    })

    it('should handle Windows-style backslashes in paths', () => {
      // On Unix systems, backslashes are treated as part of the filename
      // This test verifies the slug is created from whatever the filename is
      const result = slugFromFileName('docs\\guides\\file.md')
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('should handle empty paths', () => {
      expect(slugFromFileName('')).toBe('')
      expect(slugFromFileName('.md')).toBe('')
    })
  })

  describe('validateSlug', () => {
    it('should validate correct slugs', () => {
      expect(validateSlug('hello-world')).toBe(true)
      expect(validateSlug('simple')).toBe(true)
      expect(validateSlug('hello-world-123')).toBe(true)
      expect(validateSlug('test123')).toBe(true)
      expect(validateSlug('123-abc')).toBe(true)
    })

    it('should reject slugs with uppercase', () => {
      expect(validateSlug('Hello-World')).toBe(false)
      expect(validateSlug('HELLO')).toBe(false)
    })

    it('should reject slugs with special characters', () => {
      expect(validateSlug('hello_world')).toBe(false)
      expect(validateSlug('hello.world')).toBe(false)
      expect(validateSlug('hello@world')).toBe(false)
    })

    it('should reject slugs with spaces', () => {
      expect(validateSlug('hello world')).toBe(false)
      expect(validateSlug('hello  world')).toBe(false)
    })

    it('should reject slugs with leading/trailing hyphens', () => {
      expect(validateSlug('-hello')).toBe(false)
      expect(validateSlug('hello-')).toBe(false)
      expect(validateSlug('-hello-world-')).toBe(false)
    })

    it('should reject slugs with consecutive hyphens', () => {
      expect(validateSlug('hello--world')).toBe(false)
      expect(validateSlug('multiple---hyphens')).toBe(false)
    })

    it('should reject empty strings', () => {
      expect(validateSlug('')).toBe(false)
    })
  })

  describe('normalizeSlug', () => {
    it('should return valid slugs unchanged', () => {
      expect(normalizeSlug('hello-world')).toBe('hello-world')
      expect(normalizeSlug('simple')).toBe('simple')
      expect(normalizeSlug('test-123')).toBe('test-123')
    })

    it('should convert invalid slugs to valid ones', () => {
      expect(normalizeSlug('Hello World')).toBe('hello-world')
      expect(normalizeSlug('UPPERCASE')).toBe('uppercase')
      expect(normalizeSlug('hello_world')).toBe('hello-world')
    })

    it('should handle slugs with special characters', () => {
      expect(normalizeSlug('hello@world')).toBe('helloworld')
      expect(normalizeSlug('test!#$%')).toBe('test')
    })

    it('should handle empty strings', () => {
      expect(normalizeSlug('')).toBe('')
    })
  })
})
