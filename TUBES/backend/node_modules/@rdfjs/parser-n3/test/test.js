import { strictEqual } from 'assert'
import sinkTest from '@rdfjs/sink/test/index.js'
import { describe, it } from 'mocha'
import { Readable } from 'readable-stream'
import chunks from 'stream-chunks/chunks.js'
import N3Parser from '../index.js'

describe('@rdfjs/parser-n3', () => {
  sinkTest(N3Parser, { readable: true })

  describe('.import', () => {
    it('should parse the given string triple stream', async () => {
      const nt = '[] <http://example.org/predicate> "object" .'
      const parser = new N3Parser()

      const stream = parser.import(Readable.from(nt))

      const results = await chunks(stream)
      const quad = results[0]

      strictEqual(quad.subject.termType, 'BlankNode')

      strictEqual(quad.predicate.termType, 'NamedNode')
      strictEqual(quad.predicate.value, 'http://example.org/predicate')

      strictEqual(quad.object.termType, 'Literal')
      strictEqual(quad.object.value, 'object')

      strictEqual(quad.graph.termType, 'DefaultGraph')
    })

    it('should parse N3 rule with variable', async () => {
      const n3 = '{ ?s a <http://example.org/Human> } => { ?s a <http://example.org/Mortal> } .'
      const parser = new N3Parser({ format: 'text/n3' })

      const stream = parser.import(Readable.from(n3))

      const results = await chunks(stream)

      strictEqual(results.length, 3)
    })

    it('should parse the given string quad stream', async () => {
      const nt = '<http://example.org/subject> <http://example.org/predicate> "object" <http://example.org/graph> .'
      const parser = new N3Parser()

      const stream = parser.import(Readable.from(nt))

      const results = await chunks(stream)
      const quad = results[0]

      strictEqual(quad.subject.termType, 'NamedNode')
      strictEqual(quad.subject.value, 'http://example.org/subject')

      strictEqual(quad.predicate.termType, 'NamedNode')
      strictEqual(quad.predicate.value, 'http://example.org/predicate')

      strictEqual(quad.object.termType, 'Literal')
      strictEqual(quad.object.value, 'object')

      strictEqual(quad.graph.termType, 'NamedNode')
      strictEqual(quad.graph.value, 'http://example.org/graph')
    })

    it('should emit prefix events for each prefix', async () => {
      const prefix1 = 'http://example.org/prefix1#'
      const prefix2 = 'http://example.org/prefix2#'

      const nt = `PREFIX p1: <${prefix1}>
        PREFIX p2: <${prefix2}>
        <http://example.org/subject> <http://example.org/predicate> "object" .`
      const parser = new N3Parser()
      const prefixes = {}

      const stream = parser.import(Readable.from(nt))

      stream.on('prefix', (prefix, namespace) => {
        prefixes[prefix] = namespace
      })

      await chunks(stream)

      strictEqual(typeof prefixes.p1, 'object')
      strictEqual(prefixes.p1.termType, 'NamedNode')
      strictEqual(prefixes.p1.value, prefix1)

      strictEqual(typeof prefixes.p2, 'object')
      strictEqual(prefixes.p2.termType, 'NamedNode')
      strictEqual(prefixes.p2.value, prefix2)
    })

    it('should handle parser errors', async () => {
      const nt = '1'
      const parser = new N3Parser()

      const stream = parser.import(Readable.from(nt))

      let error = null

      try {
        await chunks(stream)
      } catch (err) {
        error = err
      }

      strictEqual(typeof error, 'object')
      strictEqual(error.message.includes('literal'), true)
    })

    it('should forward blankNodePrefix option to n3 parser', async () => {
      const nt = '<http://example.org/subject> <http://example.org/predicate> _:namedBlank .'
      const parser = new N3Parser()

      const stream = parser.import(Readable.from(nt), { blankNodePrefix: '' })

      const [quad] = await chunks(stream)

      strictEqual(quad.object.value, 'namedBlank')
    })

    it('should parse a literal with a base direction', async () => {
      const nt = '<http://example.org/subject> <http://example.org/predicate> "object"@en--ltr .'
      const parser = new N3Parser()

      const stream = parser.import(Readable.from(nt))

      const [quad] = await chunks(stream)

      strictEqual(quad.object.termType, 'Literal')
      strictEqual(quad.object.value, 'object')
      strictEqual(quad.object.language, 'en')
      strictEqual(quad.object.direction, 'ltr')
    })

    it('should parse a triple term in the object position', async () => {
      const nt = '<http://example.org/subject> <http://example.org/predicate> <<(<http://example.org/s1> <http://example.org/p1> <http://example.org/o1>)>> .'
      const parser = new N3Parser()

      const stream = parser.import(Readable.from(nt))

      const results = await chunks(stream)
      strictEqual(results.length, 1)

      const [quad] = results

      strictEqual(quad.object.termType, 'Quad')
      strictEqual(quad.object.subject.value, 'http://example.org/s1')
      strictEqual(quad.object.predicate.value, 'http://example.org/p1')
      strictEqual(quad.object.object.value, 'http://example.org/o1')
    })

    it('should parse a reified triple with an implicit reifier as subject', async () => {
      const nt = '<<<http://example.org/s1> <http://example.org/p1> <http://example.org/o1>>> <http://example.org/predicate> <http://example.org/object> .'
      const parser = new N3Parser()

      const stream = parser.import(Readable.from(nt))

      const results = await chunks(stream)
      strictEqual(results.length, 2)

      const [statement, reifies] = results.sort((a, b) => a.predicate.value < b.predicate.value ? -1 : 1)

      strictEqual(reifies.subject.termType, 'BlankNode')
      strictEqual(reifies.predicate.value, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#reifies')
      strictEqual(reifies.object.termType, 'Quad')
      strictEqual(reifies.object.subject.value, 'http://example.org/s1')
      strictEqual(reifies.object.predicate.value, 'http://example.org/p1')
      strictEqual(reifies.object.object.value, 'http://example.org/o1')

      strictEqual(statement.subject.termType, 'BlankNode')
      strictEqual(statement.subject.value, reifies.subject.value)
      strictEqual(statement.predicate.value, 'http://example.org/predicate')
      strictEqual(statement.object.value, 'http://example.org/object')
    })

    it('should parse a reified triple with an explicit reifier as subject', async () => {
      const nt = '<<<http://example.org/s1> <http://example.org/p1> <http://example.org/o1> ~ <http://example.org/id>>> <http://example.org/predicate> <http://example.org/object> .'
      const parser = new N3Parser()

      const stream = parser.import(Readable.from(nt))

      const results = await chunks(stream)
      strictEqual(results.length, 2)

      const [statement, reifies] = results.sort((a, b) => a.predicate.value < b.predicate.value ? -1 : 1)

      strictEqual(reifies.subject.termType, 'NamedNode')
      strictEqual(reifies.subject.value, 'http://example.org/id')
      strictEqual(reifies.predicate.value, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#reifies')
      strictEqual(reifies.object.termType, 'Quad')
      strictEqual(reifies.object.subject.value, 'http://example.org/s1')

      strictEqual(statement.subject.value, 'http://example.org/id')
      strictEqual(statement.predicate.value, 'http://example.org/predicate')
      strictEqual(statement.object.value, 'http://example.org/object')
    })
  })
})
