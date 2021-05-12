import {exec, ExecOptions} from '@actions/exec';
import * as core from '@actions/core'

export async function getChangesIntroducedByTag(tag: string): Promise<string> {

    const previousVersionTag = await getPreviousVersionTag(tag);

    return previousVersionTag ? getCommitMessagesBetween(previousVersionTag, tag)
        : getCommitMessagesFrom(tag);
}

export async function getPreviousVersionTag(tag: string): Promise<string | null> {

    let previousTag = '';

    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                previousTag += data.toString();
            },            
        },
        silent: true, // do not log executed operations to the output
        ignoreReturnCode: true
    }
    
    const exitCode = await exec(
        'git', // name of command
        [
            'describe',                     // Looks for tags
            '--match',                      // Considers only tags that match a pattern
            'v[0-9]\.[0-9]\.[0-9]*',        // Matches only version tags
            '--abbrev=0',                   // print only tag name
            '--first-parent',               // only search the current branch in case of merge commit
            `${tag}^`                       // start looking from the parent of the specified tag
        ],
        options
    );

    core.debug(`The previous version tag us ${previousTag}`);

    return exitCode === 0 ? previousTag.trim() : null;
}

export async function getCommitMessagesBetween(firstTag: string, secondTag: string): Promise<string> {

    let commitMessages = '';

    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                commitMessages += data.toString();
            },            
        },
        silent: true, // do not log executed operations to the output
    }
    
    const exitCode = await exec(
        'git', // name of command
        [
            'log',
            '--format=%s',  //print only first line of the commit message
            `${firstTag}..${secondTag}` //return only the commits which are reachable from the second tag but not from the first tag
        ],
        options
    );  //we do not check exit code because git log does not fail

    core.debug(`The commit messages between ${firstTag} and ${secondTag} are: ${commitMessages}.` );

    return commitMessages.trim();
}

export async function getCommitMessagesFrom(tag: string): Promise<string> {

    let commitMessages = '';

    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                commitMessages += data.toString();
            },            
        },
        silent: true, // do not log executed operations to the output
    }
    
    const exitCode = await exec(
        'git', // name of command
        [
            'log',
            '--format=%s',  //print only first line of the commit message
            tag
        ],
        options
    );  //we do not check exit code because git log does not fail

    core.debug(`The commit messages from ${tag} are: ${commitMessages}.` );

    return commitMessages.trim();
}