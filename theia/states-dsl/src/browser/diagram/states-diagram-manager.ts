import { QuickPickService, WidgetManager } from '@theia/core/lib/browser';
import { EditorManager } from '@theia/editor/lib/browser';
import { Workspace } from '@theia/languages/lib/browser';
import { inject, injectable } from 'inversify';
import { DiagramManager, LSTheiaSprottyConnector, TheiaFileSaver, TheiaSprottyConnector } from 'sprotty-theia';
import { STATES_DIAGRAM_TYPE } from './states-diagram-configuration';
import { StatesDiagramLanguageClient } from './states-diagram-language-client';

@injectable()
export class StatesDiagramManager extends DiagramManager {

    readonly diagramType = STATES_DIAGRAM_TYPE;
    readonly iconClass = 'fa fa-sitemap';

    _diagramConnector: TheiaSprottyConnector;

    constructor(@inject(StatesDiagramLanguageClient) diagramLanguageClient: StatesDiagramLanguageClient,
                @inject(TheiaFileSaver) fileSaver: TheiaFileSaver,
                @inject(WidgetManager) widgetManager: WidgetManager,
                @inject(EditorManager) editorManager: EditorManager,
                @inject(Workspace) workspace: Workspace,
                @inject(QuickPickService) quickPickService: QuickPickService) {
        super();
        this._diagramConnector = new LSTheiaSprottyConnector({diagramLanguageClient, fileSaver, editorManager, widgetManager, workspace, quickPickService, diagramManager: this});
    }

    get diagramConnector() {
        return this._diagramConnector;
    }

    get label() {
        return 'State machine diagram';
    }
}