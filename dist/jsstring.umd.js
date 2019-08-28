"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.undefined = mod.exports;
  }
})(void 0, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  /*
   * jsstring.ts
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
  var asciiPrintableRange = []; // Set up ASCII character code stuff.

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
      }

      return str;
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
        if (Number.isNaN(x)) throw new TypeError("Non numeric argument ".concat(arg, " to %").concat(c));
        return (x | 0).toString();

      case 'b':
        if (Number.isNaN(x)) throw new TypeError("Non numeric argument ".concat(arg, " to %").concat(c));
        return '0b' + x.toString(2);

      case 'e':
        x = +arg;
        if (Number.isNaN(x)) throw new TypeError("Non numeric argument ".concat(arg, " to %").concat(c));
        return x.toExponential();

      case 'E':
        x = +arg;
        if (Number.isNaN(x)) throw new TypeError("Non numeric argument ".concat(arg, " to %").concat(c));
        return x.toExponential().toUpperCase();

      case 'o':
        if (Number.isNaN(x)) throw new TypeError("Non numeric argument ".concat(arg, " to %").concat(c));
        return '0o' + x.toString(8);

      case 'x':
        if (Number.isNaN(x)) throw new TypeError("Non numeric argument ".concat(arg, " to %").concat(c));
        return '0x' + x.toString(16);

      case 'X':
        if (Number.isNaN(x)) throw new TypeError("Non numeric argument ".concat(arg, " to %").concat(c));
        return '0x' + x.toString(16).toUpperCase();

      case 'f':
        x = +arg;
        if (Number.isNaN(x)) throw new TypeError("Non numeric argument ".concat(arg, " to %").concat(c));
        return '' + x;

      case 's':
        return arg.toString();

      default:
        throw new TypeError("Unrecognized formatting option %".concat(c, " to sprintf"));
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
    var _char = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_';

    var pieces = str.split(camelSplitter).filter(function (x) {
      return x;
    });
    return pieces.map(function (piece, i, arr) {
      if (isUpper(piece)) {
        var next = arr[i + 1];
        var prev = arr[i - 1];
        if (!prev) return piece;
        if (!isUpper(prev) || next && !isUpper(next)) return _char + piece;
      }

      return piece;
    }).join('').toLowerCase();
  };

  var padLeft = exports.padLeft = function padLeft(n, str) {
    var _char2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';

    return str.length > n ? str : _char2.repeat(n - str.length) + str;
  };

  var padRight = exports.padRight = function padRight(n, str) {
    var _char3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';

    return str.length > n ? str : str + _char3.repeat(n - str.length);
  }; // NOTE: does not support the full range of %[char] possiblities. If you need something more robust
  // use https://github.com/alexei/sprintf.js/blob/master/src/sprintf.js


  var sprintf = exports.sprintf = function sprintf(str) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var count = -1;
    return str.replace(printfMatch, function (m) {
      return printfFormat(m[1], args[++count]);
    });
  }; // NOTE: not cryptographically secure. For anything requiring a secure degree of
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEtBQVA7QUFDRCxLQVRJLEVBVUosSUFWSSxDQVVDLEVBVkQsRUFXSixXQVhJLEVBQVA7QUFZRCxHQWRNOztBQWdCQSxNQUFNLE9BQU8sV0FBUCxPQUFPLEdBQUcsU0FBVixPQUFVLENBQUMsQ0FBRCxFQUFZLEdBQVo7QUFBQSxRQUF3QixNQUF4Qix1RUFBdUMsR0FBdkM7O0FBQUEsV0FBdUQsR0FBRyxDQUFDLE1BQUosR0FBYSxDQUFiLEdBQzFFLEdBRDBFLEdBRTFFLE1BQUksQ0FBQyxNQUFMLENBQVksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFwQixJQUE4QixHQUZYO0FBQUEsR0FBaEI7O0FBSUEsTUFBTSxRQUFRLFdBQVIsUUFBUSxHQUFHLFNBQVgsUUFBVyxDQUFDLENBQUQsRUFBWSxHQUFaO0FBQUEsUUFBd0IsTUFBeEIsdUVBQXVDLEdBQXZDOztBQUFBLFdBQXVELEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBYixHQUMzRSxHQUQyRSxHQUUzRSxHQUFHLEdBQUcsTUFBSSxDQUFDLE1BQUwsQ0FBWSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQXBCLENBRmM7QUFBQSxHQUFqQixDLENBSVA7QUFDQTs7O0FBQ08sTUFBTSxPQUFPLFdBQVAsT0FBTyxHQUFHLFNBQVYsT0FBVSxDQUFDLEdBQUQsRUFBNkM7QUFBQSxzQ0FBNUIsSUFBNEI7QUFBNUIsTUFBQSxJQUE0QjtBQUFBOztBQUNsRSxRQUFJLEtBQUssR0FBRyxDQUFDLENBQWI7QUFDQSxXQUFPLEdBQUcsQ0FBQyxPQUFKLENBQVksV0FBWixFQUF5QixVQUFBLENBQUM7QUFBQSxhQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBRCxDQUFGLEVBQU8sSUFBSSxDQUFDLEVBQUUsS0FBSCxDQUFYLENBQWhCO0FBQUEsS0FBMUIsQ0FBUDtBQUNELEdBSE0sQyxDQUtQO0FBQ0E7OztBQUNPLE1BQU0sTUFBTSxXQUFOLE1BQU0sR0FBRztBQUNwQixJQUFBLFlBQVksRUFBRSxZQUFZLENBQUMsZUFBZSxDQUFDLGlCQUFELENBQWhCLENBRE47QUFFcEIsSUFBQSxLQUFLLEVBQUUsWUFBWSxDQUFDLGVBQWUsQ0FBQyxtQkFBRCxDQUFoQixDQUZDO0FBR3BCLElBQUEsS0FBSyxFQUFFLFlBQVksQ0FBQyxlQUFlLENBQUMsVUFBRCxDQUFoQixDQUhDO0FBSXBCLElBQUEsT0FBTyxFQUFFLFlBQVksQ0FBQyxlQUFlLENBQUMsWUFBRCxDQUFoQixDQUpEO0FBS3BCLElBQUEsS0FBSyxFQUFFLFlBQVksQ0FBQyxlQUFlLENBQUMsY0FBRCxDQUFoQixDQUxDO0FBTXBCLElBQUEsS0FBSyxFQUFFLFlBQVksQ0FBQyxlQUFlLENBQUMsY0FBRCxDQUFoQjtBQU5DLEdBQWYiLCJmaWxlIjoianNzdHJpbmcudW1kLmpzIn0=