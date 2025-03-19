import { join } from 'node:path'
import process from 'node:process'
import { createWriteStream } from 'node:fs';
import { pipeline } from 'stream/promises';

interface Options {
  owner?: string
  repo?: string
  outputDir: string
  branch: string
  subpath?: string
}

interface Tree {
  path: string
  mode: string
  type: 'blob' | 'tree'
  sha: string
  size: string
  url: string
  _path: string
  _base: string
}

function formatName(...args: string[]) {
  return args.filter(v => v).join('-').replaceAll('/', '-')
}
function getOutPutPath(options: Options) {
  const { owner, repo, subpath, outputDir } = options

  return join(process.env.PWD, outputDir || formatName(owner, repo, subpath))
}

async function writeFileFromItem(item: Tree) {
  console.log(item)
  const blob = (await request(item.url)).body;
  return pipeline(blob, createWriteStream(item._path))
}

export async function download(options: Options) {
  const { owner, repo } = options
  if (!owner || !repo) {
    throw new Error('missing required argument: owner/repo')
  }

  const tree = formatGitTree(await getGitTree(options), getOutPutPath(options))
  for (const item of tree) {
    await writeFileFromItem(item)
  }
}

async function request(url: string, init?: RequestInit) {
  let result: Promise<Response>;
  let count = 0;
  do {
    ++count;
    result = fetch(url, init)
  } while (!result || count>3);
  return result;
}

// async function request(url: string, init?: RequestInit) {
//   return (await fetch(url, init)).json()
// }

function filterTree(tree: Tree[], subpath: string) {
  if(!subpath) return tree;

  const item = tree.find(v => v.path === subpath);

  if(!item) {
    throw new Error(`subpath: ${subpath}: Not Exist \n${tree.filter(v => !v.path.includes('/')).map(v => v.path).join(`\n`)}`)
  }
  if(item.type === 'tree') {
    return tree.filter(v => {
      return v.path.startsWith(subpath)
    }).map(v => {
      v._path = v.path.replace(`${subpath}/`, '');
      return v;
    })
  }
  return [item];
}

async function getGitTree(options: Options) {
  const { owner, repo, branch, subpath } = options
  const result: any = await (await request(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`)).json();
  if(result.status === '404') {
    throw new Error(`${owner}/${repo}(${branch}): ${result.message}`)
  }

  return filterTree(result.tree, subpath);
}

function formatGitTree(tree: Tree[], base: string) {
  return tree.filter(v => v.type === 'blob').map(v => {
    v._base = join(base, v._path)
    return v;
  })
}
