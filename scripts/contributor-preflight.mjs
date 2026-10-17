import { spawnSync } from 'node:child_process';

function git(...args) {
  const run = spawnSync('git', args, { encoding: 'utf8', windowsHide: true });
  return run.status === 0 ? run.stdout.trim() : null;
}
const repository = git('rev-parse', '--is-inside-work-tree') === 'true';
const origin = repository ? git('remote', 'get-url', 'origin') : null;
const expectedOrigins = ['https://github.com/Pedro-Lucas001/boopay.git', 'https://github.com/Pedro-Lucas001/boopay',
  'git@github.com:Pedro-Lucas001/boopay.git'];
const branch = repository ? git('branch', '--show-current') : null;
const checks = [
  { id: 'git_repository', passed: repository, action: 'Abra o terminal na pasta clonada boopay.' },
  { id: 'origin_repository', passed: expectedOrigins.includes(origin), action: 'Confira origin conforme o README; este script não muda remotos.' },
  { id: 'commit_name', passed: !!git('config', '--get', 'user.name'), action: 'Configure git config user.name com seu nome.' },
  { id: 'commit_email', passed: !!git('config', '--get', 'user.email'), action: 'Configure git config user.email com seu email verificado ou noreply.' },
  { id: 'task_branch', passed: !!branch && branch !== 'main' && branch !== 'master',
    action: 'Crie/seleciona a branch da sua tarefa pelo tutorial; não envie trabalho diretamente à main.' }
];
const pending = git('status', '--porcelain');
console.log(JSON.stringify({ scope: 'Preflight local; não testa login, permissão de push, revisão ou proteção de main.',
  branch, pendingChanges: pending ? pending.split('\n').length : 0,
  checks: checks.map(check => ({ id: check.id, passed: check.passed, ...(check.passed ? {} : { nextStep: check.action }) })),
  readyForLocalWork: checks.every(check => check.passed) }, null, 2));
process.exitCode = checks.every(check => check.passed) ? 0 : 1;
