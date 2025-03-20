export function debug(...args: any[]) {
  if (globalThis.debug) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}
