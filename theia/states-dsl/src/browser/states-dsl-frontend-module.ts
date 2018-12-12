/**
 * Generated using theia-extension-generator
 */

import { StatesDslCommandContribution, StatesDslMenuContribution } from './states-dsl-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";

import { ContainerModule } from "inversify";
import { LanguageClientContribution } from '@theia/languages/lib/browser';
import { StatesLanguageClientContribution } from './states-dsl-language-client-contribution';
import { LanguageGrammarDefinitionContribution } from '@theia/monaco/lib/browser/textmate';
import { StatesGrammarContribution } from './states-dsl-grammar-contribution';
import { DiagramConfiguration, DiagramManagerProvider, DiagramManager } from 'sprotty-theia/lib';
import { StatesDiagramConfiguration } from './diagram/states-diagram-configuration';
import { StatesDiagramManager } from './diagram/states-diagram-manager';
import { FrontendApplicationContribution, OpenHandler, KeybindingContribution, WidgetFactory } from '@theia/core/lib/browser';
import { LSDiagramCommandContribution, LSDiagramKeybindingContribution } from 'sprotty-theia/lib/theia/languageserver';
import { StatesDiagramLanguageClient } from './diagram/states-diagram-language-client';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(StatesDslCommandContribution);
    bind(MenuContribution).to(StatesDslMenuContribution);
    
    bind(StatesLanguageClientContribution).toSelf().inSingletonScope();
    bind(LanguageClientContribution).toService(StatesLanguageClientContribution);
    bind(LanguageGrammarDefinitionContribution).to(StatesGrammarContribution).inSingletonScope();

    bind(StatesDiagramLanguageClient).toSelf().inSingletonScope();
    bind(CommandContribution).to(LSDiagramCommandContribution).inSingletonScope();
    bind(KeybindingContribution).to(LSDiagramKeybindingContribution).inSingletonScope();

    bind(DiagramConfiguration).to(StatesDiagramConfiguration).inSingletonScope();
    bind(StatesDiagramManager).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(StatesDiagramManager);
    bind(OpenHandler).toService(StatesDiagramManager);
    bind(WidgetFactory).toService(StatesDiagramManager);
    bind(DiagramManagerProvider).toProvider<DiagramManager>((context) => {
        return () => {
            return new Promise<DiagramManager>((resolve) => {
                let diagramManager = context.container.get<StatesDiagramManager>(StatesDiagramManager);
                resolve(diagramManager);
            });
        };
    });
});