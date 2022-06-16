import {
  initialLineState,
  tokenizeLine,
  TokenType,
  TokenMap,
} from '../src/tokenizeJulia.js'

const DEBUG = true

const expectTokenize = (text, state = initialLineState.state) => {
  const lineState = {
    state,
  }
  const tokens = []
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const result = tokenizeLine(lines[i], lineState)
    lineState.state = result.state
    tokens.push(...result.tokens.map((token) => token.type))
    tokens.push(TokenType.NewLine)
  }
  tokens.pop()
  return {
    toEqual(...expectedTokens) {
      if (DEBUG) {
        expect(tokens.map((token) => TokenMap[token])).toEqual(
          expectedTokens.map((token) => TokenMap[token])
        )
      } else {
        expect(tokens).toEqual(expectedTokens)
      }
    },
  }
}

test('empty', () => {
  expectTokenize(``).toEqual()
})

test('whitespace', () => {
  expectTokenize(' ').toEqual(TokenType.Whitespace)
})

test('keyword', () => {
  // see https://github.com/highlightjs/highlight.js/blob/main/src/languages/julia.js#L28
  expectTokenize('baremodule').toEqual(TokenType.Keyword)
  expectTokenize('begin').toEqual(TokenType.Keyword)
  expectTokenize('break').toEqual(TokenType.Keyword)
  expectTokenize('catch').toEqual(TokenType.Keyword)
  expectTokenize('ccall').toEqual(TokenType.Keyword)
  expectTokenize('const').toEqual(TokenType.Keyword)
  expectTokenize('continue').toEqual(TokenType.Keyword)
  expectTokenize('do').toEqual(TokenType.Keyword)
  expectTokenize('else').toEqual(TokenType.Keyword)
  expectTokenize('elseif').toEqual(TokenType.Keyword)
  expectTokenize('end').toEqual(TokenType.Keyword)
  expectTokenize('export').toEqual(TokenType.Keyword)
  expectTokenize('false').toEqual(TokenType.Keyword)
  expectTokenize('finally').toEqual(TokenType.Keyword)
  expectTokenize('for').toEqual(TokenType.Keyword)
  expectTokenize('function').toEqual(TokenType.Keyword)
  expectTokenize('global').toEqual(TokenType.Keyword)
  expectTokenize('if').toEqual(TokenType.Keyword)
  expectTokenize('import').toEqual(TokenType.Keyword)
  expectTokenize('in').toEqual(TokenType.Keyword)
  expectTokenize('isa').toEqual(TokenType.Keyword)
  expectTokenize('let').toEqual(TokenType.Keyword)
  expectTokenize('local').toEqual(TokenType.Keyword)
  expectTokenize('macro').toEqual(TokenType.Keyword)
  expectTokenize('module').toEqual(TokenType.Keyword)
  expectTokenize('quote').toEqual(TokenType.Keyword)
  expectTokenize('return').toEqual(TokenType.Keyword)
  expectTokenize('true').toEqual(TokenType.Keyword)
  expectTokenize('try').toEqual(TokenType.Keyword)
  expectTokenize('using').toEqual(TokenType.Keyword)
  expectTokenize('where').toEqual(TokenType.Keyword)
  expectTokenize('while').toEqual(TokenType.Keyword)
})

test('double quoted string', () => {
  expectTokenize(`"Hello" abc`).toEqual(
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.VariableName
  )
})

test('single quoted string', () => {
  expectTokenize(`'Hello' abc`).toEqual(
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.VariableName
  )
})

test('square', () => {
  expectTokenize(`z = z^2 + a`).toEqual(
    TokenType.VariableName,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.VariableName,
    TokenType.Punctuation,
    TokenType.Numeric,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.VariableName
  )
})

test('negative floating point number', () => {
  expectTokenize(`-0.05`).toEqual(
    TokenType.Punctuation,
    TokenType.Numeric,
    TokenType.Punctuation,
    TokenType.Numeric
  )
})

test('less than comparison', () => {
  expectTokenize(`x < 2`).toEqual(
    TokenType.VariableName,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric
  )
})

test('function call', () => {
  expectTokenize(`println()`).toEqual(
    TokenType.VariableName,
    TokenType.Punctuation,
    TokenType.Punctuation
  )
})

test('ternary operator', () => {
  expectTokenize(`1 ? 2 : 3`).toEqual(
    TokenType.Numeric,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric
  )
})
