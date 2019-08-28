/*
 * jsstring.ts
 * @author jasmith79
 * @copyright Jared Smith 2017
 * @license MIT
 *
 * My JavaScript string utilities, because standard library, not so much.
 *
 */

const snakeCaseMatcher = /[\-\_0-9]+([a-zA-Z])/g;
const camelSplitter = /([A-Z0-9])/;
const firstLetter = /^(\w)/;
const allFirstLetters = /\b(\w)/g;
const printfMatch = /%([a-zA-Z%])/g;

const alphaNumericRange = [];
const alphaRange = [];
const numericRange = [];
const lowerCaseRange = [];
const upperCaseRange = [];
const asciiPrintableRange = [];

// Set up ASCII character code stuff.
for (let i = 32; i < 127; ++i) {
  asciiPrintableRange.push(i);
  if (i > 47 && i < 58) {
    alphaNumericRange.push(i);
    numericRange.push(i);
  }

  if (i > 64 && i < 91) {
    alphaNumericRange.push(i);
    alphaRange.push(i);
    upperCaseRange.push(i);
  }

  if (i > 96 && i < 123) {
    alphaNumericRange.push(i);
    alphaRange.push(i);
    lowerCaseRange.push(i);
  }
}

const randomCharacter = (range: Array<number>) => (): string => {
  return String.fromCharCode(range[Math.random() * range.length | 0]);
};

const randomString = (f: () => string) => (length: number = 32): string => {
  let str = '';
  for (let i = 0; i < length; ++i) str += f();
  return str;
};

const printfFormat = (c: string, arg: any): string => {
  let x = parseInt(arg, 10);
  switch (c) {
    case 'n': return '';
    case 'c':
    case '%':
      return arg ? arg[0] : '';

    case 'd':
      if (Number.isNaN(x)) throw new TypeError(`Non numeric argument ${arg} to %${c}`);
      return (x|0).toString();

    case 'b':
      if (Number.isNaN(x)) throw new TypeError(`Non numeric argument ${arg} to %${c}`);
      return '0b' + x.toString(2);

    case 'e':
      x = +arg;
      if (Number.isNaN(x)) throw new TypeError(`Non numeric argument ${arg} to %${c}`);
      return x.toExponential();

    case 'E':
      x = +arg;
      if (Number.isNaN(x)) throw new TypeError(`Non numeric argument ${arg} to %${c}`);
      return x.toExponential().toUpperCase();

    case 'o':
      if (Number.isNaN(x)) throw new TypeError(`Non numeric argument ${arg} to %${c}`);
      return '0o' + x.toString(8);

    case 'x':
      if (Number.isNaN(x)) throw new TypeError(`Non numeric argument ${arg} to %${c}`);
      return '0x' + x.toString(16);

    case 'X':
      if (Number.isNaN(x)) throw new TypeError(`Non numeric argument ${arg} to %${c}`);
      return '0x' + x.toString(16).toUpperCase();

    case 'f':
      x = +arg;
      if (Number.isNaN(x)) throw new TypeError(`Non numeric argument ${arg} to %${c}`);
      return '' + x;

    case 's': return arg.toString();

    default: throw new TypeError(`Unrecognized formatting option %${c} to sprintf`);
  }
};

const matchToUpper = (m: string): string => m.toUpperCase();
const isUpper = (s: string): boolean => s === s.toUpperCase();

export const isNumeric = (str: string): boolean => !Number.isNaN(+str);

export const capFirst = (str: string): string => str.replace(firstLetter, matchToUpper);

export const capFirstAll = (str: string): string => str.replace(allFirstLetters, matchToUpper);

export const toCamelCase = (str: string): string => (
  str.replace(snakeCaseMatcher, m => m.replace(/[\-\_]+/g, '').toUpperCase())
);

export const toPascalCase = (str: string): string => capFirst(toCamelCase(str));

export const toClassCase = toPascalCase;

export const toSnakeCase = (str: string): string => {
  const pieces = str.split(camelSplitter).filter(x => x);
  return pieces
    .map((piece, i, arr) => {
      if (isUpper(piece)) {
        const next = arr[i + 1];
        const prev = arr[i - 1];
        if (!prev) return piece;
        if (!isUpper(prev) || (next && !isUpper(next))) return `_${piece}`;
      }
      return piece;
    })
    .join('')
    .toLowerCase();
};

export const padLeft = (n: number, str:string, char: string = ' '): string => str.length > n 
  ? str
  : char.repeat(n - str.length) + str;

export const padRight = (n: number, str:string, char: string = ' '): string => str.length > n 
  ? str
  : str + char.repeat(n - str.length);

// NOTE: does not support the full range of %[char] possiblities. If you need something more robust
// use https://github.com/alexei/sprintf.js/blob/master/src/sprintf.js
export const sprintf = (str: string, ...args: Array<any>): string => {
  let count = -1;
  return str.replace(printfMatch, m => printfFormat(m[1], args[++count]));
};

// NOTE: not cryptographically secure. For anything requiring a secure degree of
// randomness use the browser's/node's crypto implementation.
export const random = {
  alphanumeric: randomString(randomCharacter(alphaNumericRange)),
  ascii: randomString(randomCharacter(asciiPrintableRange)),
  alpha: randomString(randomCharacter(alphaRange)),
  numeric: randomString(randomCharacter(numericRange)),
  upper: randomString(randomCharacter(upperCaseRange)),
  lower: randomString(randomCharacter(lowerCaseRange))
};
