import { SGraphFactory, SChildElement, SModelElementSchema, SParentElement, SEdge, SGraph, hoverFeedbackFeature, popupFeature } from "sprotty/lib";

export class StatesModelFactory extends SGraphFactory {

    protected initializeChild(child: SChildElement, schema: SModelElementSchema, parent?: SParentElement): SChildElement {
        super.initializeChild(child, schema, parent);
        if (child instanceof SEdge)
            child.targetAnchorCorrection = Math.sqrt(5)
        return child
    }
}

export class StatesDiagram extends SGraph {
    hasFeature(feature: symbol): boolean {
        return feature === hoverFeedbackFeature || feature === popupFeature || super.hasFeature(feature);
    }
}
