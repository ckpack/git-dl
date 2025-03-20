import type { Options, Tree } from './type.js';
import { Buffer } from 'node:buffer';
// import { createWriteStream } from 'node:fs';
import { access, constants, mkdir, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';
import process from 'node:process';
// import { pipeline } from 'node:stream/promises';
import { minimatch } from 'minimatch';
import { request } from './request.js';

function filterTree(tree: Tree[], options: Options) {
  const { subpath, glob } = options;
  if (!subpath && !glob) {
    return tree.filter(v => v.type === 'blob');
  }

  const result = tree.filter((v) => {
    return v.type === 'blob' && (glob ? minimatch(v.path, glob, { matchBase: true, partial: true }) : true && subpath ? v.path.startsWith(subpath) : true);
  });

  if (!result.length) {
    throw new Error(`subpath: ${subpath} : Not Exist In https://github.com/${options.owner}/${options.repo}/tree/${options.branch} \n${tree.filter(v => !v.path.includes('/')).map(v => v.path).join(`\n`)}`);
  }
  return result;
}

export async function getGitTree(options: Options, base: string) {
  const { owner, repo, branch } = options;
  const result: any = await (await request(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`)).json();

  if (!result.tree) {
    if (result.status === '404') {
      throw new Error(`${owner}/${repo}(${branch}): ${result.message}`);
    }
    throw new Error(JSON.stringify(result, null, 2));
  }

  const tree = result.tree.map((v: Tree) => {
    v._url = `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${branch}/${v.path}`;
    v._out = join(base, v.path);
    return v;
  });

  return filterTree(tree, options);
}

export function getOutPutPath(options: Options) {
  const { repo, outputDir } = options;

  return join(process.env.PWD, outputDir || repo);
}

export async function writeFileFromItem(item: Tree) {
  const blob: any = await (await request(item.url)).json();
  await mkdirRecursive(parse(item._out).dir);
  return writeFile(item._out, Buffer.from(blob?.content, 'base64'));
  // const blob = (await request(item._url)).body;
  // await mkdirRecursive(parse(item._out).dir);
  // return pipeline(blob, createWriteStream(item._out));
}

export async function mkdirRecursive(dir: string, options?: { existsHandler: any }) {
  try {
    await access(dir, constants.F_OK);
    await options?.existsHandler(dir);
  }
  catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    await mkdir(dir, {
      recursive: true,
    });
  }
}
