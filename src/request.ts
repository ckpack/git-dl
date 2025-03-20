import { env } from 'node:process';
import { debug } from './logger.js';

export async function request(url: string, init: RequestInit = {}) {
  const TOKEN = globalThis.token || env.GITHUB_TOKEN;
  if (TOKEN) {
    init.headers = new Headers({
      Authorization: `Bearer ${TOKEN}`,
    });
  }
  debug(`requset: ${url}`);
  let result: Promise<Response>;
  let count = 0;
  do {
    ++count;
    result = fetch(url, init);
  } while (!result || count > 3);
  return result;
}
