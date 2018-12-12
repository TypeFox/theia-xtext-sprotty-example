import { LanguageGrammarDefinitionContribution, TextmateRegistry } from '@theia/monaco/lib/browser/textmate';
import { injectable } from 'inversify';
import { STATES_LANGUAGE_FILE_EXTENSION, STATES_LANGUAGE_SERVER_ID, STATES_LANGUAGE_SERVER_NAME } from '../common';

@injectable()
export class StatesGrammarContribution implements LanguageGrammarDefinitionContribution {

    registerTextmateLanguage(registry: TextmateRegistry) {
        monaco.languages.register({
            id: STATES_LANGUAGE_SERVER_ID,
            aliases: [
                STATES_LANGUAGE_SERVER_NAME, STATES_LANGUAGE_SERVER_ID
            ],
            extensions: [
                STATES_LANGUAGE_FILE_EXTENSION,
            ],
            mimetypes: [
                'text/sm'
            ]
        });
    }
}
