(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.jsstring = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /*
   * jsstring.js
   * @author jasmith79
   * @copyright Jared Smith 2017
   * @license MIT
   *
   * My JavaScript string utilities, because standard library, not so much.
   *
   */

  var snakeCaseMatcher = /[\-\_0-9]+([a-zA-Z])/g;
  var camelSplitter = /([A-Z0-9])/;
  var firstLetter = /^(\w)/;
  var allFirstLetters = /\b(\w)/g;
  var printfMatch = /%([a-zA-Z%])/g;

  var alphaNumericRange = [];
  var alphaRange = [];
  var numericRange = [];
  var lowerCaseRange = [];
  var upperCaseRange = [];
  var asciiPrintableRange = [];

  for (var i = 32; i < 127; ++i) {
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

  var randomCharacter = function randomCharacter(range) {
    return function () {
      return String.fromCharCode(range[Math.random() * range.length | 0]);
    };
  };

  var randomString = function randomString(f) {
    return function () {
      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;

      var str = '';
      for (var _i = 0; _i < length; ++_i) {
        str += f();
      }return str;
    };
  };

  var printfFormat = function printfFormat(c, arg) {
    var x = parseInt(arg, 10);
    switch (c) {
      case 'n':
        return '';
      case 'c':
      case '%':
        return arg ? arg[0] : '';

      case 'd':
        if (Number.isNaN(x)) throw new TypeError('Non numeric argument ' + arg + ' to %' + c);
        return (x | 0).toString();

      case 'b':
        if (Number.isNaN(x)) throw new TypeError('Non numeric argument ' + arg + ' to %' + c);
        return '0b' + x.toString(2);

      case 'e':
        x = +arg;
        if (Number.isNaN(x)) throw new TypeError('Non numeric argument ' + arg + ' to %' + c);
        return x.toExponential();

      case 'E':
        x = +arg;
        if (Number.isNaN(x)) throw new TypeError('Non numeric argument ' + arg + ' to %' + c);
        return x.toExponential().toUpperCase();

      case 'o':
        if (Number.isNaN(x)) throw new TypeError('Non numeric argument ' + arg + ' to %' + c);
        return '0o' + x.toString(8);

      case 'x':
        if (Number.isNaN(x)) throw new TypeError('Non numeric argument ' + arg + ' to %' + c);
        return '0x' + x.toString(16);

      case 'X':
        if (Number.isNaN(x)) throw new TypeError('Non numeric argument ' + arg + ' to %' + c);
        return '0x' + x.toString(16).toUpperCase();

      case 'f':
        x = +arg;
        if (Number.isNaN(x)) throw new TypeError('Non numeric argument ' + arg + ' to %' + c);
        return '' + x;

      case 's':
        return arg.toString();

      default:
        throw new TypeError('Unrecognized formatting option %' + c + ' to sprintf');
    }
  };

  var matchToUpper = function matchToUpper(m) {
    return m.toUpperCase();
  };
  var isUpper = function isUpper(s) {
    return s === s.toUpperCase();
  };

  var isNumeric = exports.isNumeric = function isNumeric(str) {
    return !Number.isNaN(+str);
  };

  var capFirst = exports.capFirst = function capFirst(str) {
    return str.replace(firstLetter, matchToUpper);
  };

  var capFirstAll = exports.capFirstAll = function capFirstAll(str) {
    return str.replace(allFirstLetters, matchToUpper);
  };

  var toCamelCase = exports.toCamelCase = function toCamelCase(str) {
    return str.replace(snakeCaseMatcher, function (m) {
      return m.replace(/[\-\_]+/g, '').toUpperCase();
    });
  };

  var toPascalCase = exports.toPascalCase = function toPascalCase(str) {
    return capFirst(toCamelCase(str));
  };

  var toClassCase = exports.toClassCase = toPascalCase;

  var toSnakeCase = exports.toSnakeCase = function toSnakeCase(str) {
    var char = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_';

    var pieces = str.split(camelSplitter).filter(function (x) {
      return x;
    });
    return pieces.map(function (piece, i, arr) {
      if (isUpper(piece)) {
        var next = arr[i + 1];
        var prev = arr[i - 1];
        if (!prev) return piece;
        if (!isUpper(prev) || next && !isUpper(next)) return char + piece;
      }
      return piece;
    }).join('').toLowerCase();
  };

  var padLeft = exports.padLeft = function padLeft(n, str) {
    var char = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';
    return str.length > n ? str : char.repeat(n - str.length) + str;
  };
  var padRight = exports.padRight = function padRight(n, str) {
    var char = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';
    return str.length > n ? str : str + char.repeat(n - str.length);
  };

  // NOTE: does not support the full range of %[char] possiblities. If you need something more robust
  // use https://github.com/alexei/sprintf.js/blob/master/src/sprintf.js
  var sprintf = exports.sprintf = function sprintf(str) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var count = -1;
    return str.replace(printfMatch, function (m) {
      return printfFormat(m[1], args[++count]);
    });
  };

  // NOTE: not cryptographically secure. For anything requiring a secure degree of
  // randomness use the browser's/node's crypto implementation.
  var random = exports.random = {
    alphanumeric: randomString(randomCharacter(alphaNumericRange)),
    ascii: randomString(randomCharacter(asciiPrintableRange)),
    alpha: randomString(randomCharacter(alphaRange)),
    numeric: randomString(randomCharacter(numericRange)),
    upper: randomString(randomCharacter(upperCaseRange)),
    lower: randomString(randomCharacter(lowerCaseRange))
  };
});

