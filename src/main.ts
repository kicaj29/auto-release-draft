import * as core from '@actions/core'

export async function run(): Promise<void> {
  try {
    core.setOutput('release-url', 'https://example.com');
  } catch (error) {
    // set exit code of the action to something different then zero and print error message to the build log:
    core.setFailed(error.message)
  }
}

run()
