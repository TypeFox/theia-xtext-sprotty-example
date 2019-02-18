import { LanguageClientFactory, Languages, Workspace } from '@theia/languages/lib/browser';
import { inject, injectable, multiInject } from 'inversify';
import { DiagramLanguageClientContribution, DiagramManagerProvider } from 'sprotty-theia';
import { STATES_LANGUAGE_FILE_EXTENSION, STATES_LANGUAGE_SERVER_ID, STATES_LANGUAGE_SERVER_NAME } from '../common';

@injectable()
export class StatesLanguageClientContribution extends DiagramLanguageClientContribution {

    readonly id = STATES_LANGUAGE_SERVER_ID;
    readonly name = STATES_LANGUAGE_SERVER_NAME;

    constructor(
        @inject(Workspace) protected readonly workspace: Workspace,
        @inject(Languages) protected readonly languages: Languages,
        @inject(LanguageClientFactory) protected readonly languageClientFactory: LanguageClientFactory,
        @multiInject(DiagramManagerProvider) protected diagramManagerProviders: DiagramManagerProvider[]) {
        super(workspace, languages, languageClientFactory, diagramManagerProviders)
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
