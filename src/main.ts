import * as core from '@actions/core'
import * as event from './event';
import * as version from './version';
import * as git from './git';
import * as github from './github';

export async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token');
    let releaseUrl = 'NOT_SET';

    const tag = event.getCreatedTag();
    core.info(`Created tag is: ${tag}`);

    if (tag && version.isSemVer(tag)) {
      core.info(`Created tag is sem ver.`);
      const changelog = await git.getChangesIntroducedByTag(tag);

      releaseUrl = await github.createReleaseDraft(tag, token, changelog);
    }

    core.setOutput('release-url', releaseUrl);
  } catch (error) {
    // set exit code of the action to something different then zero and print error message to the build log:
    core.setFailed(error.message)
  }
}

run()
