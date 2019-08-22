package io.typefox.examples.theia.states.ide.diagram

import org.eclipse.sprotty.ServerLayoutKind
import org.eclipse.sprotty.xtext.DiagramServerFactory
import org.eclipse.sprotty.xtext.LanguageAwareDiagramServer

class StatesDiagramServerFactory extends DiagramServerFactory {

	override getDiagramTypes() {
		#['states-diagram']
	}
	
	override createDiagramServer(String diagramType, String clientId) {
		val server = super.createDiagramServer(diagramType, clientId)
		if (server instanceof LanguageAwareDiagramServer)
			server.serverLayoutKind = ServerLayoutKind.AUTOMATIC
		server
	}
}