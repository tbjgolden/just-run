/**
 * Convert an input code string to a node-friendly esm code string
 */
export declare const transform: (
  inputCode: string,
  filePath?: string | undefined
) => Promise<string>;
/**
 * Convert source code from an entry file into a directory of node-friendly esm code
 */
export declare const build: (
  entryFilePath: string,
  outputDirectory?: string | undefined
) => Promise<string | undefined>;
/**
 * Runs a file, no questions asked (auto-transpiling it and its dependencies as required)
 */
export declare const run: (
  entryFilePath: string,
  args?: string[],
  outputDirectory?: string | undefined
) => Promise<number>;
//# sourceMappingURL=index.d.ts.map
