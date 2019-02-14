/** @jsx html */
import { html } from 'snabbdom-jsx';

import { RenderingContext, IView, SButton } from "sprotty";
import { VNode } from "snabbdom/vnode";
import { injectable } from 'inversify';

@injectable()
export class PaletteButtonView implements IView {
    render(button: SButton, context: RenderingContext): VNode {
        return <div>{button.id}</div>;
    }
}
