import { inject, injectable } from "inversify";
import { CompletionLabelEditor, isTraceable, LSTheiaDiagramServer, RenameLabelEditor } from "sprotty-theia";
import { Action, ActionHandlerRegistry, EditLabelAction, getSubType, IModelFactory, ReconnectCommand, 
    SLabel, SModelRoot, TYPES } from "sprotty";

@injectable()
export class StatesDiagramServer extends LSTheiaDiagramServer {

    @inject(CompletionLabelEditor) completionLabelEditor: CompletionLabelEditor;
    @inject(RenameLabelEditor) renameLabelEditor: RenameLabelEditor;
    @inject(TYPES.IModelFactory) modelFactory: IModelFactory;

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

