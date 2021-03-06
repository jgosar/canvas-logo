import {Injectable} from '@angular/core';
import {isDefined} from 'src/app/helpers/common.helpers';
import {replaceAll} from 'src/app/helpers/string.helpers';
import type {Reducer} from 'src/app/utils/reducer-store/reducer';
import type {LogoStoreState} from '../logo.store.state';
import type {CodeBlock} from '../types/code-block';
import {evaluateArgument} from 'src/app/helpers/logo-variable.helpers';

export interface ExecuteCommandPayload {
    command: string;
    logToHistory?: boolean;
}

@Injectable()
export class ExecuteCommandReducer implements Reducer<LogoStoreState, ExecuteCommandPayload> {
    reduce(state: LogoStoreState, payload: ExecuteCommandPayload): LogoStoreState {
        let newState: LogoStoreState = {...state};

        const commandTokens: string[] = this.tokenizeCommand(payload.command);
        let index = 0;

        while (index < commandTokens.length) {
            const commandName: string = commandTokens[index];
            const codeBlock: CodeBlock = state.codeBlocks[commandName];

            if (!isDefined(codeBlock)) {
                throw new Error(`Function ${commandName} does not exist!`);
            }

            const commandArgs: string[] = this.parseCommandArgs(codeBlock, commandTokens, index);
            newState = this.executeCommand(newState, codeBlock, commandArgs);

            index += 1 + commandArgs.length; // parsed command name + number of args
            if (isDefined(codeBlock.terminatedBy)) {
                index++; // also parsed terminating word, such as END
            }
        }

        if (payload.logToHistory) {
            newState = {
                ...newState,
                history: [...newState.history, payload.command],
                historyPointer: newState.history.length + 1,
            };
        }
        return newState;
    }

    private executeCommand(state: LogoStoreState, codeBlock: CodeBlock, commandArgs: string[]) {
        if (!isDefined(codeBlock.skipArgsEvaluation)) {
            commandArgs = commandArgs.map(arg => evaluateArgument(state, arg));
        }

        if (isDefined(codeBlock.reducer)) {
            return codeBlock.reducer.reduce(state, commandArgs);
        } else {
            return this.reduce(state, {command: this.formatCommandTextWithArgs(codeBlock.commandText, commandArgs)});
        }
    }

    private parseCommandArgs(codeBlock: CodeBlock, commandTokens: string[], index: number): string[] {
        const commandName: string = commandTokens[index];
        let lastArgIndex: number;

        if (isDefined(codeBlock.terminatedBy)) {
            lastArgIndex = commandTokens.findIndex(x => x === codeBlock.terminatedBy);

            if (lastArgIndex === -1) {
                throw new Error(`Call of function ${commandName}, must end with ${codeBlock.terminatedBy}`);
            }
        } else {
            lastArgIndex = index + 1 + codeBlock.numArgs;
            if (commandTokens.length < lastArgIndex) {
                throw new Error(`Too few arguments for function ${commandName}`);
            }
        }
        return commandTokens.slice(index + 1, lastArgIndex);
    }

    private formatCommandTextWithArgs(commandText: string, args: string[]): string {
        return args.reduce(
            (commandText, arg, argIndex) => replaceAll(commandText, `@ARG${argIndex}@`, arg),
            commandText
        );
    }

    private beautifyCommand(command: string): string {
        return command.toUpperCase().replace(/\s\s+/g, ' ').trim();
    }

    private tokenizeCommand(command: string): string[] {
        command = this.beautifyCommand(command);

        const bracketedExpressions: string[] = [];
        let processedCommand: string = command;

        let bracketLevel: number = 0;
        let bracketStartIndex: number = -1;
        for (let i = 0; i < command.length; i++) {
            if (command[i] === '[') {
                if (bracketLevel === 0) {
                    bracketStartIndex = i;
                }

                bracketLevel++;
            } else if (command[i] === ']') {
                bracketLevel--;

                if (bracketLevel === 0) {
                    const bracketedExpression: string = command.substring(bracketStartIndex, i + 1).trim();
                    bracketedExpressions.push(bracketedExpression.substring(1, bracketedExpression.length - 1));
                    processedCommand = processedCommand.replace(
                        bracketedExpression,
                        `bracketedExpression-${bracketedExpressions.length - 1}`
                    );
                }
                if (bracketLevel < 0) {
                    throw new Error(`More closing than opening brackets! position ${i}`);
                }
            }
        }

        if (bracketLevel !== 0) {
            throw new Error('Closing bracket missing!');
        }
        return processedCommand
            .split(' ')
            .map(token =>
                token.startsWith('bracketedExpression-') ? bracketedExpressions[token.split('-')[1]] : token
            );
    }
}
