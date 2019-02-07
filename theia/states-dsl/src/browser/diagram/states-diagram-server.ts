import { inject, injectable } from "inversify";
import { TheiaDiagramServer } from "sprotty-theia/lib";
import { CompletionLabelEditor, isTraceable, RenameLabelEditor } from "sprotty-theia/lib/sprotty/languageserver";
import { Action, ActionHandlerRegistry, EditLabelAction, getSubType, IActionDispatcher, ILogger, IModelFactory, ReconnectCommand, SLabel, SModelRoot, SModelStorage, TYPES, ViewerOptions } from "sprotty/lib";

@injectable()
export class StatesDiagramServer extends TheiaDiagramServer {

    @inject(CompletionLabelEditor) completionLabelEditor: CompletionLabelEditor;
    @inject(RenameLabelEditor) renameLabelEditor: RenameLabelEditor;
    @inject(TYPES.IModelFactory) modelFactory: IModelFactory;

    constructor(@inject(TYPES.IActionDispatcher) public actionDispatcher: IActionDispatcher,
        @inject(TYPES.ActionHandlerRegistry) actionHandlerRegistry: ActionHandlerRegistry,
        @inject(TYPES.ViewerOptions) viewerOptions: ViewerOptions,
        @inject(TYPES.SModelStorage) storage: SModelStorage,
        @inject(TYPES.ILogger) logger: ILogger) {
        super(actionDispatcher, actionHandlerRegistry, viewerOptions, storage, logger);
    }

    initialize(registry: ActionHandlerRegistry) {
        super.initialize(registry);
        registry.register(ReconnectCommand.KIND, this);
        registry.register(EditLabelAction.KIND, this);
    }

    handleLocally(action: Action): boolean {
        if (action.kind === EditLabelAction.KIND) {
            const label = this.getElement((action as EditLabelAction).labelId);
            if (label instanceof SLabel && isTraceable(label))
                if (getSubType(label) === 'xref')
                    this.completionLabelEditor.edit(label);
                else
                    this.renameLabelEditor.edit(label);
            return false;
        }
        return super.handleLocally(action);
    }

    private getElement(elementId: string) {
        const root = (this.currentRoot instanceof SModelRoot)
            ? this.currentRoot
            : this.modelFactory.createRoot(this.currentRoot);
        return root.index.getById(elementId);
    }
}

