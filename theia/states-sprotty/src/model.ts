import { hoverFeedbackFeature, popupFeature, SChildElement, SEdge, SGraph, SGraphFactory, SModelElementSchema, 
    SParentElement, CircularPort, CreatingOnDrag, Action, CreateElementAction, creatingOnDragFeature, RectangularNode, Routable } from "sprotty/lib";

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

export class StatesNode extends RectangularNode {
    canConnect(routable: Routable, role: string) {
        return true;
    }
}

export class CreateTransitionPort extends CircularPort implements CreatingOnDrag {
    createAction(id: string): Action {
        return new CreateElementAction(this.root.id, <SModelElementSchema> {
            id, type: 'edge', sourceId: this.parent.id, targetId: this.id
        });
    }

    hasFeature(feature: symbol): boolean {
        return feature === popupFeature || feature === creatingOnDragFeature || super.hasFeature(feature);
    }
}

