// Shared utilities, types, or constants for Zelda-ish monorepo

export function exampleSharedUtil(msg: string): string {
  return `Shared: ${msg}`;
}

export type ExampleSharedType = {
  id: string;
  value: number;
};
