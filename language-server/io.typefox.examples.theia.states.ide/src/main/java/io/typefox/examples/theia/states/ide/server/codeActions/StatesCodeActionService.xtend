package io.typefox.examples.theia.states.ide.server.codeActions

import com.google.inject.Inject
import com.google.inject.Provider
import io.typefox.examples.theia.states.states.StateMachine
import io.typefox.examples.theia.states.states.StatesFactory
import java.util.List
import org.eclipse.emf.ecore.EObject
import org.eclipse.lsp4j.CodeAction
import org.eclipse.lsp4j.CodeActionParams
import org.eclipse.lsp4j.Command
import org.eclipse.lsp4j.Diagnostic
import org.eclipse.lsp4j.Position
import org.eclipse.lsp4j.Range
import org.eclipse.lsp4j.TextEdit
import org.eclipse.lsp4j.WorkspaceEdit
import org.eclipse.lsp4j.jsonrpc.messages.Either
import org.eclipse.xtext.ide.serializer.IChangeSerializer
import org.eclipse.xtext.ide.serializer.IChangeSerializer.IModification
import org.eclipse.xtext.ide.server.Document
import org.eclipse.xtext.ide.server.UriExtensions
import org.eclipse.xtext.ide.server.codeActions.ICodeActionService2
import org.eclipse.xtext.ide.server.rename.ChangeConverter2
import org.eclipse.xtext.resource.EObjectAtOffsetHelper
import org.eclipse.xtext.resource.XtextResource

import static io.typefox.examples.theia.states.validation.StatesValidator.*

import static extension org.eclipse.xtext.util.Strings.*

class StatesCodeActionService implements ICodeActionService2 {

	@Inject extension UriExtensions
	@Inject EObjectAtOffsetHelper offsetHelper
	@Inject ChangeConverter2.Factory changeConverterFactory
	@Inject Provider<IChangeSerializer> changeSerializerProvider

	static val CREATE_STATE_KIND = 'sprotty.create.state'
	static val CREATE_EVENT_KIND = 'sprotty.create.event'

	override getCodeActions(Options options) {
		var root = options.resource.contents.head
		if (root instanceof StateMachine)
			createCodeActions(root, options)
		else
			emptyList
	}

	// null-safe
	private def dispatch List<Either<Command, CodeAction>> createCodeActions(Void element, Options option) {
		return emptyList
	}

	private def dispatch List<Either<Command, CodeAction>> createCodeActions(EObject element, Options option) {
		return emptyList
	}

	private def dispatch List<Either<Command, CodeAction>> createCodeActions(StateMachine stateMachine,
		Options options) {
		val document = options.document
		val resource = options.resource
		val params = options.codeActionParams
		val uri = resource.URI.toUriString
		val result = <Either<Command, CodeAction>>newArrayList
		if (CREATE_STATE_KIND.matchesContext(params)) {
			// Prior Xtext 2.18.0 (Appends to the end of the document)
			result.add(Either.forRight(new CodeAction => [
				kind = CREATE_STATE_KIND
				title = 'new State'
				edit = createInsertWorkspaceEdit(
					uri,
					document.getPosition(document.contents.length),
					'''«'\n'»state «getNewName('state', stateMachine.states.map[name])»'''
				)
			]))
			val editWithChangeSerializer = createCodeActionWithChangeSerializer(
				options, [ StateMachine stateMachineCopy |
					stateMachineCopy.states += StatesFactory.eINSTANCE.createState => [
						name = getNewName('state', stateMachine.states.map[name])
					]
				])
			if (editWithChangeSerializer !== null) {
				result.add(Either.forRight(new CodeAction => [
					kind = CREATE_STATE_KIND
					title = 'new State (with change serializer)'
					edit = editWithChangeSerializer
				]))
			}
		}
		if (CREATE_EVENT_KIND.matchesContext(params)) {
			// Prior Xtext 2.18.0 (Appends to the end of the document)
			result.add(Either.forRight(new CodeAction => [
				kind = CREATE_EVENT_KIND
				title = 'new Event'
				edit = createInsertWorkspaceEdit(
					uri,
					document.getPosition(document.contents.length),
					'''«'\n'»event «getNewName('event', stateMachine.events.map[name])»'''
				)
			]))
			val editWithChangeSerializer = createCodeActionWithChangeSerializer(
				options, [ StateMachine stateMachineCopy |
					stateMachineCopy.events += StatesFactory.eINSTANCE.createEvent => [
						name = getNewName('event', stateMachine.events.map[name])
					]
				])
			if (editWithChangeSerializer !== null) {
				result.add(Either.forRight(new CodeAction => [
					kind = CREATE_EVENT_KIND
					title = 'new Event (with change serializer)'
					edit = editWithChangeSerializer
				]))
			}
		}

		// Quick fixes
		result.addAll(params.context.diagnostics.map[toQuickFixCodeAction(resource, document)].filterNull)

		return result
	}

	private def <T extends EObject> WorkspaceEdit createCodeActionWithChangeSerializer(Options options,
		IModification<T> modification) {

		val languageServerAccess = options.languageServerAccess
		val referringResourceURI = options.resource.URI
		// create a working copy as we are not allowed to change the resource directly
		val workingCopy = languageServerAccess.newLiveScopeResourceSet(referringResourceURI)
		// retrieve resource from working copy
		val referringResource = workingCopy.getResource(referringResourceURI, true)
		if (referringResource instanceof XtextResource) {
			val changeSerializer = changeSerializerProvider.get
			// apply the modification on the state machine object from the copied resource
			changeSerializer.addModification(referringResource.contents.head as T, modification)
			val workspaceEdit = new WorkspaceEdit
			val changeConverter = changeConverterFactory.create(workspaceEdit, languageServerAccess)
			// apply modifications to workspaceEdit
			changeSerializer.applyModifications(changeConverter)
			// create the workspace edit
			return workspaceEdit
		}
		return null
	}

	private def Either<Command, CodeAction> toQuickFixCodeAction(Diagnostic it, XtextResource resource,
		Document document) {

		if (code == DISCOURAGED_NAME) {
			val object = offsetHelper.resolveElementAt(resource, document.getOffSet(range.start))
			if (object instanceof StateMachine) {
				val uri = resource.URI.toUriString
				val start = range.start
				val end = new Position(start.line, start.character + 1)
				val edit = new TextEdit(new Range(start, end), object.name.substring(0, 1).toFirstUpper)
				return Either.forRight(new CodeAction => [
					kind = 'quickfix'
					title = 'Fix name'
					edit = new WorkspaceEdit => [
						changes = #{uri -> #[edit]}
					]
				])
			}
		}
		return null
	}

	private def matchesContext(String kind, CodeActionParams params) {
		if (params.context?.only === null)
			return true
		else
			return params.context.only.exists[kind.startsWith(it)]
	}

	private def String getNewName(String prefix, List<? extends String> siblings) {
		for (var i = 0;; i++) {
			val currentName = prefix + i
			if (!siblings.exists[it == currentName])
				return currentName
		}
	}

	private def createInsertWorkspaceEdit(String uri, Position position, String text) {
		new WorkspaceEdit => [
			changes = #{uri -> #[new TextEdit(new Range(position, position), text)]}
		]
	}

}
