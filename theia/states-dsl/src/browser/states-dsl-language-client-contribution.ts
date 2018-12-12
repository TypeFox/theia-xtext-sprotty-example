import { BaseLanguageClientContribution, LanguageClientFactory, Languages, Workspace } from '@theia/languages/lib/browser';
import { inject, injectable } from 'inversify';
import { STATES_LANGUAGE_SERVER_ID, STATES_LANGUAGE_SERVER_NAME, STATES_LANGUAGE_FILE_EXTENSION } from '../common';

@injectable()
export class StatesLanguageClientContribution extends BaseLanguageClientContribution {

    readonly id = STATES_LANGUAGE_SERVER_ID;
    readonly name = STATES_LANGUAGE_SERVER_NAME;

    constructor(
        @inject(Workspace) protected readonly workspace: Workspace,
        @inject(Languages) protected readonly languages: Languages,
        @inject(LanguageClientFactory) protected readonly languageClientFactory: LanguageClientFactory
    ) {
        super(workspace, languages, languageClientFactory);
    }

    protected get globPatterns(): string[] {
        return [
            '**/*' + STATES_LANGUAGE_FILE_EXTENSION,
        ];
    }

    protected get documentSelector(): string[] {
        return [
            STATES_LANGUAGE_SERVER_ID
        ];
    }
}
