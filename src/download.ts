import type { Options } from './type.js';
import { access, constants, mkdir } from 'node:fs/promises';
import process from 'node:process';
import { getGitTree, getOutPutPath, writeFileFromItem } from './github.js';
import { debug } from './logger.js';
import { question } from './question.js';

export async function download(options: Options) {
  debug(options);
  const { owner, repo } = options;
  if (!owner || !repo) {
    throw new Error('missing required argument: owner/repo');
  }

  const base = getOutPutPath(options);

  try {
    await access(base, constants.F_OK);

    await question({
      query: `${base} 已存在 是否覆盖 true|false? \n\n`,
      async handler(val: string) {
        if (val !== 'true') {
          process.exit(0);
        }
      },
    });
  }
  catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    await mkdir(base, {
      recursive: true,
    });
  }

  const tree = await getGitTree(options, base);
  for (const item of tree) {
    await writeFileFromItem(item);
    debug('write file:', item._out);
  }
}
