package io.typefox.examples.theia.states.ide.symbol

import org.eclipse.emf.ecore.EClass
import org.eclipse.lsp4j.SymbolKind
import org.eclipse.xtext.ide.server.symbol.DocumentSymbolMapper.DocumentSymbolKindProvider

import static io.typefox.examples.theia.states.states.StatesPackage.Literals.*

class StatesDocumentSymbolKindProvider extends DocumentSymbolKindProvider {

	override protected getSymbolKind(EClass it) {
		if (it === TRANSITION) {
			return SymbolKind.Operator;
		}
		return super.getSymbolKind(it);
	}

}
