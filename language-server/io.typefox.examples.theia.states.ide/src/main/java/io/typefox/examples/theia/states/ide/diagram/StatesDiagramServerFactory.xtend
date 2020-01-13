package io.typefox.examples.theia.states.ide.diagram

import org.eclipse.sprotty.xtext.DiagramServerFactory

class StatesDiagramServerFactory extends DiagramServerFactory {

	override getDiagramTypes() {
		#['states-diagram']
	}
}