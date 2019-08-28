export declare const isNumeric: (str: string) => boolean;
export declare const capFirst: (str: string) => string;
export declare const capFirstAll: (str: string) => string;
export declare const toCamelCase: (str: string) => string;
export declare const toPascalCase: (str: string) => string;
export declare const toClassCase: (str: string) => string;
export declare const toSnakeCase: (str: string, char?: string) => string;
export declare const padLeft: (n: number, str: string, char?: string) => string;
export declare const padRight: (n: number, str: string, char?: string) => string;
export declare const sprintf: (str: string, ...args: any[]) => string;
export declare const random: {
    alphanumeric: (length?: number) => string;
    ascii: (length?: number) => string;
    alpha: (length?: number) => string;
    numeric: (length?: number) => string;
    upper: (length?: number) => string;
    lower: (length?: number) => string;
};
