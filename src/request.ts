import { debug } from './logger.js';

export async function request(url: string, init?: RequestInit) {
  debug(`requset: ${url}`);
  let result: Promise<Response>;
  let count = 0;
  do {
    ++count;
    result = fetch(url, init);
  } while (!result || count > 3);
  return result;
}
