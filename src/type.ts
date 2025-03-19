export interface Options {
  owner?: string;
  repo?: string;
  outputDir: string;
  branch: string;
  subpath?: string;
}

export interface Tree {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size: string;
  url: string;
  _url: string;
  _path: string;
  _out: string;
}
