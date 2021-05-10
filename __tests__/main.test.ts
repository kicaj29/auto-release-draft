import * as core from '@actions/core';
import { run } from '../src/main';

// mock the actions API (it will create in-memory objects that fake API from the actions):
jest.mock('@actions/core');

describe('When running the action', () => {
  const fakeSetOutput = core.setOutput as jest.MockedFunction<typeof core.setOutput>;

  test('it should set the release-url output paramter', async () => {
    await run();

    //check if the function has been called with first param with value 'release-url' and second param with any value (but null or undefined).
    expect(fakeSetOutput).toHaveBeenCalledWith('release-url', expect.anything());
  });

});