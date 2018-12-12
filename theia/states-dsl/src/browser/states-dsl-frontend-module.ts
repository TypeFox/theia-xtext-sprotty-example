/**
 * Generated using theia-extension-generator
 */

import { StatesDslCommandContribution, StatesDslMenuContribution } from './states-dsl-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";

import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
    // add your contribution bindings here
    
    bind(CommandContribution).to(StatesDslCommandContribution);
    bind(MenuContribution).to(StatesDslMenuContribution);
    
});