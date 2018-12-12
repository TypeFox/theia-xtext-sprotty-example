/**
 * Generated using theia-extension-generator
 */

import { StatesDslCommandContribution, StatesDslMenuContribution } from './states-dsl-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";
import { LanguageClientContribution } from '@theia/languages/lib/browser';
import { StatesLanguageClientContribution } from './states-dsl-language-client-contribution';
import { LanguageGrammarDefinitionContribution } from '@theia/monaco/lib/browser/textmate';
import { StatesGrammarContribution } from './states-dsl-grammar-contribution';

import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
    // add your contribution bindings here
    
    bind(CommandContribution).to(StatesDslCommandContribution);
    bind(MenuContribution).to(StatesDslMenuContribution);
    
    bind(LanguageClientContribution).to(StatesLanguageClientContribution).inSingletonScope();
    bind(LanguageGrammarDefinitionContribution).to(StatesGrammarContribution).inSingletonScope();
});