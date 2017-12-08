/*
 * jsstring.js
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
const printfFormat = (c, arg) => {
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

const matchToUpper = m => m.toUpperCase();
const isUpper = s => s === s.toUpperCase();

export const isNumeric = str => !Number.isNaN(+str);

export const capFirst = str => str.replace(firstLetter, matchToUpper);

export const capFirstAll = str => str.replace(allFirstLetters, matchToUpper);

export const toCamelCase = str => str.replace(snakeCaseMatcher, m => m.replace(/[\-\_]+/g, '').toUpperCase());

export const toPascalCase = str => capFirst(toCamelCase(str));

export const toClassCase = toPascalCase;

export const toSnakeCase = str => {
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

export const padLeft = (n, str, char=' ') => str.length > n ? str : char.repeat(n - str.length) + str;
export const padRight = (n, str, char=' ') => str.length > n ? str : str + char.repeat(n - str.length);

// NOTE: does not support the full range of %[char] possiblities. If you need something more robust
// use https://github.com/alexei/sprintf.js/blob/master/src/sprintf.js
export const sprintf = (str, ...args) => {
  let count = -1;
  return str.replace(printfMatch, m => printfFormat(m[1], args[++count]));
};
