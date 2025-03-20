import { Command } from 'commander';
import config from '../package.json' with { type: 'json' };
import { download } from './download.js';

const program = new Command();

program
  .name(config.name)
  .description(config.description)
  .version(config.version);

program
  .argument('<owner/repo>', 'owner/repo, such a ckvv/github-download')
  .argument('[output-dir]', 'output-dir')
  .option('-b, --branch <char>', 'branch name', 'main')
  .option('-s, --subpath <char>', 'subpath')
  .option('-g, --glob <char>', 'glob expressions')
  .option('-d, --debug', 'show debug log')
  .option('-t, --token <char>', 'github token')
  .action(async (ownerRepoName: string, outputDir, options) => {
    const [owner, repo] = ownerRepoName.split('/');

    globalThis.debug = options.debug;
    globalThis.token = options.token;

    await download({
      owner,
      repo,
      outputDir,
      ...options,
    });
  });

const configProgram = program.command('config');

configProgram
  .command('set')
  .requiredOption('-t, --token <char>', '设置 token')
  .action(async (...options: any) => {
    throw new Error('todo', options);
  });

configProgram
  .command('get')
  .requiredOption('-t, --token <char>', '获取 token')
  .action(async (...options: any) => {
    throw new Error('todo', options);
  });

program.parse();
