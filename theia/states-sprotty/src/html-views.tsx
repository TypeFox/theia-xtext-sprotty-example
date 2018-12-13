/** @jsx html */
import { html } from 'snabbdom-jsx';

import { RenderingContext, IView, SButton } from "sprotty/lib";
import { VNode } from "snabbdom/vnode";

export class PaletteButtonView implements IView {
    render(button: SButton, context: RenderingContext): VNode {
        return <div>{button.id}</div>;
    }
}
