import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { CommonMenus } from "@theia/core/lib/browser";

export const StatesDslCommand = {
    id: 'StatesDsl.command',
    label: "Shows a message"
};

@injectable()
export class StatesDslCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(StatesDslCommand, {
            execute: () => this.messageService.info('Hello World!')
        });
    }
}

@injectable()
export class StatesDslMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: StatesDslCommand.id,
            label: 'Say Hello'
        });
    }
}