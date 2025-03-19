import { Command } from 'commander'
import config from '../package.json' with { type: 'json' }
import { download } from './utils.ts'

const program = new Command();

program
.name(config.name)
.description(config.description)
.version(config.version)


program
.argument('<owner/repo>', 'owner/repo, such a ckvv/github-download')
.argument('[output-dir]', 'output-dir')
.option('-b, --branch <char>', 'branch name', 'main')
.option('-s, --subpath <char>', 'subpath')
.action(async(ownerRepoName: string, outputDir, options) => {
  const [owner, repo] = ownerRepoName.split('/');
  download({
    owner,
    repo,
    outputDir,
    ...options,
  });
});

// https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
const configProgram = program.command('config');

configProgram
.command('set')
.requiredOption('-t, --token <char>' , '设置 token')
.action(async(...options: any) => {
  download(options);
})

configProgram
.command('get')
.requiredOption('-t, --token <char>' , '获取 token')
.action(async(...options: any) => {
  download(options);
})

program.parse();
