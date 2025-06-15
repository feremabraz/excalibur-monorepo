export function exampleSharedUtil(msg: string): string {
  return `Shared: ${msg}`;
}

export type ExampleSharedType = {
  id: string;
  value: number;
};
