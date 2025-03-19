import type { Options, Tree } from './type.js';
import { createWriteStream } from 'node:fs';
import { access, constants, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { pipeline } from 'node:stream/promises';
import { formatGitTree, getGitTree } from './github.js';
import { debug } from './logger.js';
import { question } from './question.js';
import { request } from './request.js';

function formatName(...args: string[]) {
  return args.filter(v => v).join('-').replaceAll('/', '-');
}

function getOutPutPath(options: Options) {
  const { owner, repo, subpath, outputDir } = options;

  return join(process.env.PWD, outputDir || formatName(owner, repo, subpath));
}

async function writeFileFromItem(item: Tree) {
  if (item.type === 'tree') {
    return mkdir(item._out, {
      recursive: true,
    });
  }
  const blob = (await request(item._url)).body;
  return pipeline(blob, createWriteStream(item._out));
}

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

  const tree = formatGitTree(await getGitTree(options), base);
  for (const item of tree) {
    await writeFileFromItem(item);
  }
}
