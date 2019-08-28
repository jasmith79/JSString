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
    var pieces = str.split(camelSplitter).filter(function (x) {
      return x;
    });
    return pieces.map(function (piece, i, arr) {
      if (isUpper(piece)) {
        var next = arr[i + 1];
        var prev = arr[i - 1];
        if (!prev) return piece;
        if (!isUpper(prev) || next && !isUpper(next)) return "_".concat(piece);
      }

      return piece;
    }).join('').toLowerCase();
  };

  var padLeft = exports.padLeft = function padLeft(n, str) {
    var _char = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';

    return str.length > n ? str : _char.repeat(n - str.length) + str;
  };

  var padRight = exports.padRight = function padRight(n, str) {
    var _char2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';

    return str.length > n ? str : str + _char2.repeat(n - str.length);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0osV0FYSSxFQUFQO0FBWUQsR0FkTTs7QUFnQkEsTUFBTSxPQUFPLFdBQVAsT0FBTyxHQUFHLFNBQVYsT0FBVSxDQUFDLENBQUQsRUFBWSxHQUFaO0FBQUEsUUFBd0IsS0FBeEIsdUVBQXVDLEdBQXZDOztBQUFBLFdBQXVELEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBYixHQUMxRSxHQUQwRSxHQUUxRSxLQUFJLENBQUMsTUFBTCxDQUFZLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBcEIsSUFBOEIsR0FGWDtBQUFBLEdBQWhCOztBQUlBLE1BQU0sUUFBUSxXQUFSLFFBQVEsR0FBRyxTQUFYLFFBQVcsQ0FBQyxDQUFELEVBQVksR0FBWjtBQUFBLFFBQXdCLE1BQXhCLHVFQUF1QyxHQUF2Qzs7QUFBQSxXQUF1RCxHQUFHLENBQUMsTUFBSixHQUFhLENBQWIsR0FDM0UsR0FEMkUsR0FFM0UsR0FBRyxHQUFHLE1BQUksQ0FBQyxNQUFMLENBQVksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFwQixDQUZjO0FBQUEsR0FBakIsQyxDQUlQO0FBQ0E7OztBQUNPLE1BQU0sT0FBTyxXQUFQLE9BQU8sR0FBRyxTQUFWLE9BQVUsQ0FBQyxHQUFELEVBQTZDO0FBQUEsc0NBQTVCLElBQTRCO0FBQTVCLE1BQUEsSUFBNEI7QUFBQTs7QUFDbEUsUUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFiO0FBQ0EsV0FBTyxHQUFHLENBQUMsT0FBSixDQUFZLFdBQVosRUFBeUIsVUFBQSxDQUFDO0FBQUEsYUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUQsQ0FBRixFQUFPLElBQUksQ0FBQyxFQUFFLEtBQUgsQ0FBWCxDQUFoQjtBQUFBLEtBQTFCLENBQVA7QUFDRCxHQUhNLEMsQ0FLUDtBQUNBOzs7QUFDTyxNQUFNLE1BQU0sV0FBTixNQUFNLEdBQUc7QUFDcEIsSUFBQSxZQUFZLEVBQUUsWUFBWSxDQUFDLGVBQWUsQ0FBQyxpQkFBRCxDQUFoQixDQUROO0FBRXBCLElBQUEsS0FBSyxFQUFFLFlBQVksQ0FBQyxlQUFlLENBQUMsbUJBQUQsQ0FBaEIsQ0FGQztBQUdwQixJQUFBLEtBQUssRUFBRSxZQUFZLENBQUMsZUFBZSxDQUFDLFVBQUQsQ0FBaEIsQ0FIQztBQUlwQixJQUFBLE9BQU8sRUFBRSxZQUFZLENBQUMsZUFBZSxDQUFDLFlBQUQsQ0FBaEIsQ0FKRDtBQUtwQixJQUFBLEtBQUssRUFBRSxZQUFZLENBQUMsZUFBZSxDQUFDLGNBQUQsQ0FBaEIsQ0FMQztBQU1wQixJQUFBLEtBQUssRUFBRSxZQUFZLENBQUMsZUFBZSxDQUFDLGNBQUQsQ0FBaEI7QUFOQyxHQUFmIiwiZmlsZSI6Impzc3RyaW5nLnVtZC5qcyJ9