/**
 * Generated using theia-extension-generator
 */

import { FrontendApplicationContribution, KeybindingContribution, OpenHandler, WidgetFactory } from '@theia/core/lib/browser';
import { CommandContribution, MenuContribution } from "@theia/core/lib/common";
import { LanguageClientContribution } from '@theia/languages/lib/browser';
import { LanguageGrammarDefinitionContribution } from '@theia/monaco/lib/browser/textmate';
import { ContainerModule } from "inversify";
import { DiagramConfiguration, DiagramManager, DiagramManagerProvider, LSDiagramCommandContribution, 
    LSDiagramKeybindingContribution } from 'sprotty-theia';
import { StatesDiagramConfiguration } from './diagram/states-diagram-configuration';
import { StatesDiagramLanguageClient } from './diagram/states-diagram-language-client';
import { StatesDiagramManager } from './diagram/states-diagram-manager';
import { StatesDslCommandContribution, StatesDslMenuContribution } from './states-dsl-contribution';
import { StatesGrammarContribution } from './states-dsl-grammar-contribution';
import { StatesLanguageClientContribution } from './states-dsl-language-client-contribution';

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