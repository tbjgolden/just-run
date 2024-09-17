import fs from "node:fs";
import fsPath from "node:path";

import { Options, parse } from "acorn";
import { findNodeAt } from "acorn-walk";

export type Method = "import" | "require";
export type KnownExtension = "js" | "ts" | "jsx" | "tsx" | "cjs" | "cts" | "mjs" | "mts";

const KNOWN_EXT_SET = new Set(
  // prettier-ignore
  ["js", "ts", "jsx", "tsx", "cjs", "cts", "mjs", "mts"]
);

export const getKnownExt = (filePath: string): KnownExtension | undefined => {
  const ext = fsPath.extname(filePath).slice(1).toLowerCase();
  return KNOWN_EXT_SET.has(ext) ? (ext as KnownExtension) : undefined;
};

export class XnrError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "XnrError";
  }
}

export const prettyPath = (filePath: string) => {
  return filePath.startsWith(process.cwd()) ? fsPath.relative(process.cwd(), filePath) : filePath;
};

export const parseModule = (a: string, b?: Options) => {
  return parse(a, { ...b, sourceType: "module", ecmaVersion: "latest" });
};

const MODULE_ONLY_NODE_TYPE_SET = new Set([
  "ExportAllDeclaration",
  "ExportDefaultDeclaration",
  "ExportNamedDeclaration",
  "ExportSpecifier",
  "ImportAttribute",
  "ImportDeclaration",
  "ImportDefaultSpecifier",
  "ImportNamespaceSpecifier",
  "ImportSpecifier",
]);

export const determineModuleType = (filePath: string): Method => {
  const lowercaseExtension = filePath.slice(-4).toLowerCase();
  if (lowercaseExtension === ".mjs" || lowercaseExtension === ".mts") {
    return "import";
  } else if (lowercaseExtension === ".cjs" || lowercaseExtension === ".cts") {
    return "require";
  } else {
    const ast = parseModule(fs.readFileSync(filePath, "utf8"));
    return findNodeAt(ast, undefined, undefined, (nodeType) =>
      MODULE_ONLY_NODE_TYPE_SET.has(nodeType)
    )
      ? "import"
      : "require";
  }
};