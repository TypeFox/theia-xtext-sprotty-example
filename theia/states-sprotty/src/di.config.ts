import { Container, ContainerModule } from "inversify";
import 'sprotty-theia/css/theia-sprotty.css';
import 'sprotty/css/sprotty.css';
import { boundsModule, buttonModule, configureModelElement, ConsoleLogger, defaultModule, expandModule, 
    exportModule, fadeModule, hoverModule, HtmlRoot, HtmlRootView, LogLevel, modelSourceModule, moveModule, 
    openModule, overrideViewerOptions, PreRenderedElement, PreRenderedView, RectangularNodeView, SEdge, 
    selectModule, SGraphView, SLabel, SLabelView, TYPES, undoRedoModule, viewportModule, decorationModule, 
    SModelRoot, edgeEditModule, SRoutingHandle, SRoutingHandleView, CreateElementCommand } from 'sprotty/lib';
import "../css/diagram.css";
import { PolylineArrowEdgeView, TriangleButtonView } from "./views";
import { StatesModelFactory, StatesDiagram, StatesNode, CreateTransitionPort } from "./model";

const statesDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
    rebind(TYPES.IModelFactory).to(StatesModelFactory);

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, 'graph', StatesDiagram, SGraphView);
    configureModelElement(context, 'node', StatesNode, RectangularNodeView);
    configureModelElement(context, 'label', SLabel, SLabelView);
    configureModelElement(context, 'edge', SEdge, PolylineArrowEdgeView);
    configureModelElement(context, 'html', HtmlRoot, HtmlRootView);
    configureModelElement(context, 'pre-rendered', PreRenderedElement, PreRenderedView);
    configureModelElement(context, 'palette', SModelRoot, HtmlRootView);
    configureModelElement(context, 'routing-point', SRoutingHandle, SRoutingHandleView);
    configureModelElement(context, 'volatile-routing-point', SRoutingHandle, SRoutingHandleView);
    configureModelElement(context, 'port', CreateTransitionPort, TriangleButtonView)

    bind(TYPES.ICommand).toConstructor(CreateElementCommand);
});

export function createStateDiagramContainer(widgetId: string): Container {
    const container = new Container();
    container.load(defaultModule, selectModule, moveModule, boundsModule, undoRedoModule, viewportModule,
        hoverModule, fadeModule, exportModule, expandModule, openModule, buttonModule, modelSourceModule,
        decorationModule, edgeEditModule, statesDiagramModule);
    overrideViewerOptions(container, {
        needsClientLayout: true,
        needsServerLayout: true,
        baseDiv: widgetId,
        hiddenDiv: widgetId + '_hidden'
    });
    return container;
}