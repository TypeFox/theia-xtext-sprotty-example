import { Container, ContainerModule } from "inversify";
import {
    ConsoleLogger, LogLevel, PolylineEdgeView, SEdge,
    SGraphView, SLabelView, TYPES, boundsModule,
    buttonModule, configureModelElement, defaultModule, expandModule,
    exportModule, fadeModule, hoverModule, modelSourceModule, moveModule,
    openModule, overrideViewerOptions, selectModule, undoRedoModule,
    viewportModule, RectangularNodeView, SGraphFactory, HtmlRoot,
    HtmlRootView, PreRenderedElement, PreRenderedView, SLabel, SGraph, RectangularNode
} from 'sprotty/lib';
import 'sprotty/css/sprotty.css';
import 'sprotty-theia/css/theia-sprotty.css';
import "../../../css/diagram.css";

const statesDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
    bind(SGraphFactory).toSelf().inSingletonScope();

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, 'graph', SGraph, SGraphView);
    configureModelElement(context, 'node', RectangularNode, RectangularNodeView);
    configureModelElement(context, 'label', SLabel, SLabelView);
    configureModelElement(context, 'edge', SEdge, PolylineEdgeView);
    configureModelElement(context, 'html', HtmlRoot, HtmlRootView);
    configureModelElement(context, 'pre-rendered', PreRenderedElement, PreRenderedView);
});

export function createStateDiagramContainer(widgetId: string): Container {
    const container = new Container();
    container.load(defaultModule, selectModule, moveModule, boundsModule, undoRedoModule, viewportModule,
        hoverModule, fadeModule, exportModule, expandModule, openModule, buttonModule, modelSourceModule,
        statesDiagramModule);
    overrideViewerOptions(container, {
        needsClientLayout: true,
        needsServerLayout: true,
        baseDiv: widgetId
    });
    return container;
}
