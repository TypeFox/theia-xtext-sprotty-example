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
        monaco.languages.setLanguageConfiguration(STATES_LANGUAGE_SERVER_ID, this.configuration);

        const statesGrammar = require('../../data/states.tmLanguage.json');
        registry.registerTextmateGrammarScope('source.sm', {
            async getGrammarDefinition() {
                return {
                    format: 'json',
                    content: statesGrammar,
                };
            }
        });
        registry.mapLanguageIdToTextmateGrammar(STATES_LANGUAGE_SERVER_ID, 'source.sm');
    }

    protected configuration: monaco.languages.LanguageConfiguration = {
        'comments': {
            'lineComment': '//',
            'blockComment': ['/*', '*/']
        },
        'brackets': [
            ['{', '}'],
            ['[', ']'],
            ['(', ')']
        ],
        'autoClosingPairs': [
            { 'open': '{', 'close': '}' },
            { 'open': '[', 'close': ']' },
            { 'open': '(', 'close': ')' },
            { 'open': "'", 'close': "'", 'notIn': ['string', 'comment'] },
            { 'open': '"', 'close': '"', 'notIn': ['string'] },
            { 'open': '/**', 'close': ' */', 'notIn': ['string'] }
        ],
        'surroundingPairs': [
            { 'open': '{', 'close': '}' },
            { 'open': '[', 'close': ']' },
            { 'open': '(', 'close': ')' },
            { 'open': "'", 'close': "'" },
            { 'open': '"', 'close': '"' },
            { 'open': '`', 'close': '`' }
        ],
        'folding': {
            'markers': {
                'start': new RegExp('^\\s*//\\s*#?region\\b'),
                'end': new RegExp('^\\s*//\\s*#?endregion\\b')
            }
        }
    };
}
