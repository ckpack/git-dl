import type { Options, Tree } from './type.js';
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { pipeline } from 'node:stream/promises';
import { request } from './request.js';

function filterTree(tree: Tree[], options: Options) {
  const { subpath, owner, repo, branch } = options;

  if (!subpath) {
    return tree.map((v) => {
      v._url = `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${branch}/${v.path}`;
      v._path = v.path.replace(`${subpath}/`, '');
      return v;
    });
  }

  const item = tree.find(v => v.path === subpath);

  if (!item) {
    throw new Error(`subpath: ${subpath}: Not Exist \n${tree.filter(v => !v.path.includes('/')).map(v => v.path).join(`\n`)}`);
  }
  if (item.type === 'tree') {
    return tree.filter((v) => {
      return v.path.startsWith(subpath);
    }).map((v) => {
      v._url = `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${branch}/${v.path}`;
      v._path = v.path.replace(`${subpath}/`, '');
      return v;
    });
  }
  return [item];
}

export async function getGitTree(options: Options) {
  const { owner, repo, branch } = options;
  const result: any = await (await request(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`)).json();
  if (result.status === '404') {
    throw new Error(`${owner}/${repo}(${branch}): ${result.message}`);
  }

  return filterTree(result.tree, options);
}

export function formatGitTree(tree: Tree[], base: string) {
  return tree.map((v) => {
    v._out = join(base, v._path);
    return v;
  });
}

function formatName(...args: string[]) {
  return args.filter(v => v).join('-').replaceAll('/', '-');
}

export function getOutPutPath(options: Options) {
  const { owner, repo, subpath, outputDir } = options;

  return join(process.env.PWD, outputDir || formatName(owner, repo, subpath));
}

export async function writeFileFromItem(item: Tree) {
  if (item.type === 'tree') {
    return mkdir(item._out, {
      recursive: true,
    });
  }
  const blob = (await request(item._url)).body;
  return pipeline(blob, createWriteStream(item._out));
}
