import { inject, injectable } from "inversify";
import { TheiaDiagramServer } from "sprotty-theia/lib";
import { WorkspaceEditAction, WorkspaceEditCommand } from "sprotty-theia/lib/sprotty/languageserver";
import { Action, ActionHandlerRegistry, IActionDispatcher, ICommand, ILogger, SModelStorage, TYPES, ViewerOptions } from "sprotty/lib";

@injectable()
export class StatesDiagramServer extends TheiaDiagramServer {

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
}

