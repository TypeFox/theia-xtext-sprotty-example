import { inject, injectable } from "inversify";
import { TheiaDiagramServer } from "sprotty-theia/lib";
import { WorkspaceEditAction, WorkspaceEditCommand, CompletionLabelEditor, RenameLabelEditor, isTraceable } from "sprotty-theia/lib/sprotty/languageserver";
import { Action, ActionHandlerRegistry, IActionDispatcher, ICommand, ILogger, SModelStorage, TYPES, ViewerOptions, ReconnectCommand, EditLabelAction, SModelRoot, IModelFactory, SLabel, getSubType } from "sprotty/lib";

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
        registry.register(WorkspaceEditCommand.KIND, this);
        registry.register(ReconnectCommand.KIND, this);
        registry.register(EditLabelAction.KIND, this);
    }

    handle(action: Action): void | ICommand {
        if (action.kind === WorkspaceEditCommand.KIND) {
            const workspace = this.getWorkspace();
            if (workspace) {
                return new WorkspaceEditCommand(new WorkspaceEditAction((action as any)["workspaceEdit"], workspace));
            }
            return undefined;
        }
        return super.handle(action);
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

