const { Octokit } = require('@octokit/core');

const githubEnvClone = async ({ owner, repo, srcEnv, destEnv, replaceValues = true }) => {
  try {
    const octokit = new Octokit({
      auth: process.env.PAT
    });

    const result = await octokit.request('GET /repos/{owner}/{repo}/environments/{environment}/variables', {
      owner,
      repo,
      environment: srcEnv,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    for (const variable of result.data.variables) {
      await octokit.request('POST /repos/{owner}/{repo}/environments/{environment}/variables', {
        owner,
        repo,
        environment: destEnv,
        name: variable.name,
        value: replaceValues ? variable.value.replace(srcEnv, destEnv) : variable.value,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
    }

    console.log('done copying');
  } catch (e) {
    console.log(e.message);
    throw new Error(e.message);
  }
};

githubEnvClone({
  owner: 'gamesafeTeam',
  repo: 'gs-ml-grooming',
  srcEnv: 'dev',
  destEnv: 'test',
  replaceValues: true
});
