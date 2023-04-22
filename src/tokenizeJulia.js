/**
 * @enum number
 */
const State = {
  None: 0,
  TopLevelContent: 1,
  InsideSingleQuoteString: 2,
  InsideDoubleQuoteString: 3,
  InsideTripleQuoteString: 4,
}

/**
 * @enum number
 */
export const TokenType = {
  None: 99999999,
  Keyword: 951,
  Whitespace: 0,
  NewLine: 771,
  VariableName: 2,
  Punctuation: 3,
  String: 4,
  Numeric: 5,
  Attribute: 6,
  KeywordReturn: 8,
  LanguageConstant: 9,
  KeywordImport: 10,
  KeywordControl: 11,
  KeywordOperator: 12,
  KeywordFunction: 13,
}

export const TokenMap = {
  [TokenType.None]: 'None',
  [TokenType.Keyword]: 'Keyword',
  [TokenType.Whitespace]: 'Whitespace',
  [TokenType.NewLine]: 'NewLine',
  [TokenType.VariableName]: 'VariableName',
  [TokenType.Punctuation]: 'Punctuation',
  [TokenType.String]: 'String',
  [TokenType.Numeric]: 'Numeric',
  [TokenType.Attribute]: 'Attribute',
  [TokenType.KeywordReturn]: 'KeywordReturn',
  [TokenType.KeywordImport]: 'KeywordImport',
  [TokenType.LanguageConstant]: 'LanguageConstant',
  [TokenType.KeywordControl]: 'KeywordControl',
  [TokenType.KeywordOperator]: 'KeywordOperator',
  [TokenType.KeywordFunction]: 'KeywordFunction',
}

export const initialLineState = {
  state: State.TopLevelContent,
}

export const hasArrayReturn = true

const RE_KEYWORD =
  /^(?:baremodule|begin|break|catch|ccall|const|continue|do|else|elseif|end|export|false|finally|for|function|global|if|import|in|isa|let|local|macro|module|quote|return|true|try|using|where|while)\b/
const RE_WHITESPACE = /^\s+/
const RE_VARIABLE_NAME = /^[A-Za-z_\u00A1-\uFFFF][A-Za-z_0-9\u00A1-\uFFFF]*/
const RE_PUNCTUATION = /^[:,;\{\}\[\]\.=\(\)>\^\+\-\<\?]/
const RE_QUOTE_SINGLE = /^'/
const RE_QUOTE_DOUBLE = /^"/
const RE_STRING_SINGLE_QUOTE_CONTENT = /^[^']+/
const RE_STRING_DOUBLE_QUOTE_CONTENT = /^[^"]+/
const RE_NUMERIC = /^\d+/

/**
 * @param {string} line
 * @param {any} lineState
 */
export const tokenizeLine = (line, lineState) => {
  let next = null
  let index = 0
  let tokens = []
  let token = TokenType.None
  let state = lineState.state
  while (index < line.length) {
    const part = line.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.TopLevelContent
        } else if ((next = part.match(RE_KEYWORD))) {
          switch (next[0]) {
            case 'true':
            case 'false':
              token = TokenType.LanguageConstant
              break
            case 'import':
            case 'export':
              token = TokenType.KeywordImport
              break
            case 'begin':
            case 'break':
            case 'catch':
            case 'continue':
            case 'do':
            case 'else':
            case 'elseif':
            case 'end':
            case 'finally':
            case 'for':
            case 'if':
            case 'try':
            case 'catch':
            case 'finally':
            case 'continue':
            case 'while':
              token = TokenType.KeywordControl
              break
            case 'return':
              token = TokenType.KeywordReturn
              break
            case 'in':
              token = TokenType.KeywordOperator
              break
            case 'function':
              token = TokenType.KeywordFunction
              break
            default:
              token = TokenType.Keyword
              break
          }
          state = State.TopLevelContent
        } else if ((next = part.match(RE_VARIABLE_NAME))) {
          token = TokenType.VariableName
          state = State.TopLevelContent
        } else if ((next = part.match(RE_PUNCTUATION))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_NUMERIC))) {
          token = TokenType.Numeric
          state = State.TopLevelContent
        } else if ((next = part.match(RE_QUOTE_SINGLE))) {
          token = TokenType.Punctuation
          state = State.InsideSingleQuoteString
        } else if ((next = part.match(RE_QUOTE_DOUBLE))) {
          token = TokenType.Punctuation
          state = State.InsideDoubleQuoteString
        } else {
          part //?
          throw new Error('no')
        }
        break
      case State.InsideSingleQuoteString:
        if ((next = part.match(RE_QUOTE_SINGLE))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_STRING_SINGLE_QUOTE_CONTENT))) {
          token = TokenType.String
          state = State.InsideSingleQuoteString
        } else {
          throw new Error('no')
        }
        break
      case State.InsideDoubleQuoteString:
        if ((next = part.match(RE_QUOTE_DOUBLE))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_STRING_DOUBLE_QUOTE_CONTENT))) {
          token = TokenType.String
          state = State.InsideDoubleQuoteString
        } else {
          throw new Error('no')
        }
        break
      default:
        state
        throw new Error('no')
    }
    index += next[0].length
    const tokenLength = next[0].length
    index += tokenLength
    tokens.push(token, tokenLength)
  }
  return {
    state,
    tokens,
  }
}
