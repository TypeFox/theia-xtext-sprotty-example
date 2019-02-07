import { Container, injectable } from "inversify";
import { DiagramConfiguration, IRootPopupModelProvider, TheiaDiagramServer, TheiaDiagramServerProvider, TheiaKeyTool } from "sprotty-theia/lib";
import { CodeActionPalettePopupProvider, CodeActionProvider, CompletionLabelEditor, DeleteWithWorkspaceEditCommand, PaletteButton, PaletteMouseListener, RenameLabelEditor, WorkspaceEditCommand } from "sprotty-theia/lib/sprotty/languageserver";
import { configureCommand, KeyTool, TYPES, configureModelElement } from 'sprotty/lib';
import { createStateDiagramContainer } from 'states-sprotty/lib/di.config';
import { PaletteButtonView } from 'states-sprotty/lib/html-views';
import { StatesDiagramServer } from "./states-diagram-server";

export const STATES_DIAGRAM_TYPE = 'states-diagram';

@injectable()
export class StatesDiagramConfiguration implements DiagramConfiguration {
    diagramType = STATES_DIAGRAM_TYPE;

    createContainer(widgetId: string): Container {
        const container = createStateDiagramContainer(widgetId);
        container.bind(StatesDiagramServer).toSelf().inSingletonScope();
        container.bind(TheiaDiagramServer).toService(StatesDiagramServer);
        container.bind(TYPES.ModelSource).toService(TheiaDiagramServer);
        container.rebind(KeyTool).to(TheiaKeyTool).inSingletonScope();

        container.bind(TheiaDiagramServerProvider).toProvider<TheiaDiagramServer>((context) => {
            return () => {
                return new Promise<TheiaDiagramServer>((resolve) => {
                    resolve(context.container.get(TheiaDiagramServer));
                });
            };
        });
        container.bind(CodeActionProvider).toSelf().inSingletonScope();
        container.bind(IRootPopupModelProvider).to(CodeActionPalettePopupProvider).inSingletonScope();
        container.bind(PaletteMouseListener).toSelf().inSingletonScope();
        container.rebind(TYPES.PopupMouseListener).to(PaletteMouseListener);
        configureModelElement(container, 'button:create', PaletteButton, PaletteButtonView);
        
        configureCommand(container, DeleteWithWorkspaceEditCommand);
        configureCommand(container, WorkspaceEditCommand);

        container.bind(CompletionLabelEditor).toSelf().inSingletonScope();
        container.bind(RenameLabelEditor).toSelf().inSingletonScope();

        return container;
    }
}