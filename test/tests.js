import {
  capFirst,
  capFirstAll,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  padLeft,
  padRight,
  sprintf
} from '../src/jsstring.js';

const run = () => {
  console.assert(capFirst(' foo') === ' foo');
  console.assert(capFirst('foo') === 'Foo');
  console.assert(capFirst('foo bar') === 'Foo bar');

  console.assert(capFirstAll(' foo') === ' Foo');
  console.assert(capFirstAll('foo') === 'Foo');
  console.assert(capFirstAll('foo bar') === 'Foo Bar');
  console.assert(capFirstAll('foobar.baz') === 'Foobar.Baz');

  console.assert(toCamelCase('foo_bar_baz') === 'fooBarBaz');
  console.assert(toCamelCase('foo_bar_3baz') === 'fooBar3Baz');
  console.assert(toCamelCase('foo_XML') === 'fooXML');

  console.assert(toPascalCase('foo_bar_baz') === 'FooBarBaz');
  console.assert(toPascalCase('foo_bar_3baz') === 'FooBar3Baz');
  console.assert(toPascalCase('foo_XML') === 'FooXML');

  console.assert(toSnakeCase('FooBarBaz') === 'foo_bar_baz');
  console.assert(toSnakeCase('Foo3Bar') === 'foo_3_bar');
  console.assert(toSnakeCase('fooXML') === 'foo_xml');
  console.assert(toSnakeCase('XMLHTTPRequest') === 'xmlhttp_request');

  console.assert(padLeft(6, 'foo') === '   foo');
  console.assert(padLeft(3, '1', '0') === '001');

  console.assert(padRight(6, 'foo') === 'foo   ');
  console.assert(padRight(3, '1', '0') === '100');

  console.assert(sprintf('%c%%%s%n', 'f', 'o', 'obar', 3) === 'foobar');
  console.assert(sprintf('%d%f%b%o%x%X', 2, 3.2, 7, 8, 255, 255) === '23.20b1110o100xff0xFF');

  // Truncates to int where relevant
  console.assert(sprintf('%d%f%b%o%x%X', 2.5, 3.2, 7.12, 8.8, 255, 255) === '23.20b1110o100xff0xFF');

  console.assert(sprintf('%e', 121100) === '1.211e+5');
  console.assert(sprintf('%E', 121100) === '1.211E+5');

  let fail;
  try {
    fail = sprintf('%q', 2);
    console.log('FAILED on %q');
  } catch (e) {
    console.assert(e.toString() === 'TypeError: Unrecognized formatting option %q to sprintf');
  }

  try {
    fail = sprintf('%d', 'foo');
    console.log('FAILED on non-numeric');
  } catch (e) {
    console.assert(e.toString() === 'TypeError: Non numeric argument foo to %d');
  }
  console.log('Completed.');
};

export default run;
