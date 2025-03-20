import type { Options } from './type.js';
import process from 'node:process';
import ProgressBar from 'progress';
import { getGitTree, getOutPutPath, mkdirRecursive, writeFileFromItem } from './github.js';
import { debug } from './logger.js';
import { question } from './question.js';

export async function download(options: Options) {
  debug(options);
  const { owner, repo } = options;
  if (!owner || !repo) {
    throw new Error('missing required argument: owner/repo');
  }

  const base = getOutPutPath(options);

  await mkdirRecursive(base, {
    async existsHandler(dir: string) {
      await question({
        query: `${dir} 已存在 是否覆盖 true|false? \n\n`,
        async handler(val: string) {
          if (val !== 'true') {
            process.exit(0);
          }
        },
      });
    },
  });

  const tree = await getGitTree(options, base);

  const bar = new ProgressBar(':bar', { total: tree.length });
  for (const item of tree) {
    bar.tick();
    await writeFileFromItem(item);
    debug('write file:', item._out);
  }

  // eslint-disable-next-line no-console
  console.log(`Donwload At: ${base}`);
}
