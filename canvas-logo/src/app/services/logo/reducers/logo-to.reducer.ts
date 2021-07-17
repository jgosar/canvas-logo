import {Injectable} from '@angular/core';
import {isDefined} from 'src/app/helpers/common.helpers';
import type {Reducer} from 'src/app/utils/reducer-store/reducer';
import type {LogoStoreState} from '../logo.store.state';

@Injectable()
export class LogoToReducer implements Reducer<LogoStoreState, string[]> {
    reduce(state: LogoStoreState, args: string[]): LogoStoreState {
        this.validateTOCommand(args);
        return this.executeTOCommand(state, args);
    }

    // Input is a function definition, split into words without starting TO and final END
    private validateTOCommand(commandDefinition: string[]) {
        if (commandDefinition.length === 0) {
            // TODO: handle other reserved words
            throw new Error('"END" cannot be a function name!');
        }

        if (commandDefinition.indexOf('TO') !== -1) {
            throw new Error('"TO" statements cannot be nested!');
        }
    }

    // Input is a function definition, split into words without starting TO and final END
    private executeTOCommand(state: LogoStoreState, commandDefinition: string[]): LogoStoreState {
        const commandName: string = commandDefinition[0]; // The first word is a function name

        commandDefinition = commandDefinition.slice(1);
        const bodyStart: number = commandDefinition.findIndex(x => !x.startsWith(':')); // Start of the function body is the first word that does not start with :
        const argNames: string[] = commandDefinition.slice(0, bodyStart);
        const numArgs: number = argNames.length;
        let commandBodyWords: string[] = commandDefinition.slice(bodyStart);
        commandBodyWords = commandBodyWords.map(x => {
            // Replace argument names in the function body with their indexes
            if (x.includes(':')) {
                const argumentIndex: number = this.findLongestMatchIndex(argNames, x);
                if (!isDefined(argumentIndex)) {
                    throw new Error(`Argument ${x} is not a part of the function definition!`);
                }
                return x.replace(argNames[argumentIndex], `@ARG${argumentIndex}@`);
            }
            return x;
        });
        const commandBody = commandBodyWords.map(word => (word.includes(' ') ? `[${word}]` : word)).join(' ');

        return {
            ...state,
            codeBlocks: {
                ...state.codeBlocks,
                [commandName]: {
                    commandText: commandBody,
                    numArgs,
                },
            },
        };
    }

    private findLongestMatchIndex(searchWords: string[], text: string): number | undefined {
        return searchWords
            .map((word, index) => ({word, index}))
            .sort(this.byWordLengthDesc)
            .filter(wi => text.includes(wi.word))[0]?.index;
    }

    private byWordLengthDesc(a: {word: string; index: number}, b: {word: string; index: number}): number {
        if (a.word.length < b.word.length) {
            return 1;
        }
        if (a.word.length > b.word.length) {
            return -1;
        }
        return 0;
    }
}
