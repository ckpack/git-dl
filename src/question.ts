import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';

export async function question(options: { handler: any; query: string }) {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(options.query);
  await options.handler(answer);
  rl.close();
}
