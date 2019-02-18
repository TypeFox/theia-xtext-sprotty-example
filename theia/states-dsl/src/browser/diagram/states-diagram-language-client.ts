import { EditorManager } from "@theia/editor/lib/browser";
import { inject, injectable } from "inversify";
import { DiagramLanguageClient } from "sprotty-theia";
import { StatesLanguageClientContribution } from "../states-dsl-language-client-contribution";

@injectable()
export class StatesDiagramLanguageClient extends DiagramLanguageClient {
    constructor(
        @inject(StatesLanguageClientContribution) languageClientContribution: StatesLanguageClientContribution,
        @inject(EditorManager) editorManager: EditorManager) {
        super(languageClientContribution, editorManager)
    }
}