import type { Options, Tree } from './type.js';
import { join } from 'node:path';
import { request } from './request.js';

function filterTree(tree: Tree[], options: Options) {
  const { subpath, owner, repo, branch } = options;

  if (!subpath)
    return tree;

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
