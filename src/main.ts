import * as core from '@actions/core'
import * as event from './event';
import * as version from './version';
import * as git from './git';

export async function run(): Promise<void> {
  try {
    const tag = event.getCreatedTag();

    if (tag && version.isSemVer(tag)) {
      const changelog = await git.getChangesIntroducedByTag(tag);
    }

    core.setOutput('release-url', 'https://example.com');
  } catch (error) {
    // set exit code of the action to something different then zero and print error message to the build log:
    core.setFailed(error.message)
  }
}

run()
