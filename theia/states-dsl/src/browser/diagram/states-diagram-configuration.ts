import { Container, injectable } from "inversify";
import { DiagramConfiguration, TheiaDiagramServer, TheiaKeyTool } from "sprotty-theia/lib";
import { KeyTool, TYPES } from 'sprotty/lib';
import { createStateDiagramContainer } from './di.config';

export const STATES_DIAGRAM_TYPE = 'states-diagram';

@injectable()
export class StatesDiagramConfiguration implements DiagramConfiguration {
    diagramType = STATES_DIAGRAM_TYPE;

    createContainer(widgetId: string): Container {
        const container = createStateDiagramContainer(widgetId);
        container.bind(TYPES.ModelSource).to(TheiaDiagramServer).inSingletonScope();
        container.rebind(KeyTool).to(TheiaKeyTool).inSingletonScope();
        return container;
    }
}