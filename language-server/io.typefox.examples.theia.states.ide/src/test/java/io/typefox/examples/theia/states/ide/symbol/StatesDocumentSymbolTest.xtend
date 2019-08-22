package io.typefox.examples.theia.states.ide.symbol

import io.typefox.examples.theia.states.ide.StatesLanguageServerTest
import org.junit.jupiter.api.Test

class StatesDocumentSymbolTest extends StatesLanguageServerTest {

	@Test
	def void testDocumentSymbol_01() {
		testDocumentSymbol[
			model = '''
				statemachine SM
			'''
			expectedSymbols = '''
				symbol "SM" {
					kind: 7
					location: MyModel.sm [[0, 13] .. [0, 15]]
				}
			'''
		]
	}

}
