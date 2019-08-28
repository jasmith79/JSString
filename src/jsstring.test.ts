import {
  capFirst,
  capFirstAll,
  toCamelCase,
  toPascalCase,
  toClassCase,
  toSnakeCase,
  padLeft,
  padRight,
  sprintf,
  random,
} from './jsstring';

describe('capFirst', () => {
  it('should capitalize the first character of a string', () => {
    expect(capFirst('foobar foo bar')).toBe('Foobar foo bar');
  });  
});

describe('capFirstAll', () => {
  it('should capitalize the first character of each word in the string', () => {
    expect(capFirstAll('foobar')).toBe('Foobar');
  });

  it('should delimit by spaces', () => {
    expect(capFirstAll('foo bar')).toBe('Foo Bar');
  });

  it('should delimit by commas', () => {
    expect(capFirstAll('foo,bar')).toBe('Foo,Bar');
  });

  it('should delimit by periods', () => {
    expect(capFirstAll('foo.bar')).toBe('Foo.Bar');
    expect(capFirstAll('foo. bar')).toBe('Foo. Bar');
    expect(capFirstAll('foo.\tbar')).toBe('Foo.\tBar');
    expect(capFirstAll('foo.\nbar')).toBe('Foo.\nBar');
    expect(capFirstAll('foo.\rbar')).toBe('Foo.\rBar');
  });
});

describe('toCamelCase', () => {
  it('should turn a snake_case string to camelCase', () => {
    expect(toCamelCase('foo_bar_baz')).toBe('fooBarBaz');
    expect(toCamelCase('foo_bar_3baz')).toBe('fooBar3Baz');
    expect(toCamelCase('foo_XML')).toBe('fooXML');
  });  
});

describe('toPascalCase', () => {
  it('should turn a snake_case or camelCase string to PascalCase', () => {
    expect(toPascalCase('foo_bar_baz')).toBe('FooBarBaz');
    expect(toPascalCase('foo_bar_3baz')).toBe('FooBar3Baz');
    expect(toPascalCase('foo_XML')).toBe('FooXML');
    expect(toPascalCase('fooBarBaz')).toBe('FooBarBaz');
    expect(toPascalCase('foo3Bar')).toBe('Foo3Bar');
    expect(toPascalCase('fooXML')).toBe('FooXML');
  });  
});

describe('toClassCase, alias of toPascalCase', () => {
  expect(toClassCase).toBe(toPascalCase);
});

describe('toSnakeCase', () => {
  it('should turn a camelCase or PascalCase string to snake_case', () => {
    expect(toSnakeCase('FooBarBaz')).toBe('foo_bar_baz');
    expect(toSnakeCase('Foo3Bar')).toBe('foo_3_bar');
    expect(toSnakeCase('fooXML')).toBe('foo_xml');
    expect(toSnakeCase('XMLHTTPRequest')).toBe('xmlhttp_request');
  });  
});

describe('padLeft', () => {
  it('should leftpad a string to length n with copies of a character (defaults to space)', () => {
    expect(padLeft(6, 'foo')).toBe('   foo');
    expect(padLeft(3, '1', '0')).toBe('001');
  });  
});

describe('padRight', () => {
  it('should rightpad a string to length n with copies of a character (defaults to space)', () => {
    expect(padRight(6, 'foo')).toBe('foo   ');
    expect(padRight(3, '1', '0')).toBe('100');
  });  
});

describe('sprintf', () => {
  it('should mimic *most* of the functionality of sprintf from c', () => {
    expect(sprintf('%c%%%s%n', 'f', 'o', 'obar', 3)).toBe('foobar');
    expect(sprintf('%d%f%b%o%x%X', 2, 3.2, 7, 8, 255, 255)).toBe('23.20b1110o100xff0xFF');
    expect(sprintf('%e', 121100)).toBe('1.211e+5');
    expect(sprintf('%E', 121100)).toBe('1.211E+5');
    
    // Truncates to int where relevant
    expect(sprintf('%d%f%b%o%x%X', 2.5, 3.2, 7.12, 8.8, 255, 255)).toBe('23.20b1110o100xff0xFF');
  });

  it('should throw on unknown option', () => {
    expect(() => sprintf('%q', 2)).toThrow();
  });

  it('should throw when a non-number/numeric string is passed to %d or %i', () => {
    expect(() => sprintf('%d', 'foo')).toThrow();
    expect(() => sprintf('%i', 'foo')).toThrow();
  });
});

describe('random', () => {
  describe('alphanumeric', () => {
    it('should generate a random alphanumeric string', () => {
      expect(random.alphanumeric()).toMatch(/^[a-zA-Z0-9]+$/);
    });
  });

  describe('ascii', () => {
    it('should generate an ascii random string', () => {
      expect(random.ascii()).toMatch(/^[\w\s:;\$\^,'"\(\)\[\]\{\}=<>&!%\*@#\+-\/\?\.`]+$/);
    });
  });

  describe('alpha', () => {
    it('should generate random string of upper and lower case letters', () => {
      expect(random.alpha()).toMatch(/^[a-zA-Z]+$/);
    });
  });

  describe('numeric', () => {
    it('should generate a numeric random string', () => {
      expect(random.numeric()).toMatch(/^[0-9]+$/);
    });
  });

  describe('upper', () => {
    it('should generate a uppercase random string', () => {
      expect(random.upper()).toMatch(/^[A-Z]+$/);
    });
  });

  describe('lower', () => {
    it('should generate a lowercase random string', () => {
      expect(random.lower()).toMatch(/^[a-z]+$/);
    });
  });  
});
