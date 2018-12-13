package io.typefox.examples.theia.states.ide.diagram

import org.eclipse.sprotty.xtext.DefaultDiagramModule
import org.eclipse.sprotty.xtext.IDiagramGenerator

class StatesDiagramModule extends DefaultDiagramModule {
	
	def Class<? extends IDiagramGenerator> bindIDiagramGenerator() {
		StatesDiagramGenerator
	} 
	
	override bindIDiagramServerFactory() {
		StatesDiagramServerFactory
	}
	
	override bindILayoutEngine() {
		StatesLayoutEngine
	}
	
	override bindIDiagramServer() {
		StatesDiagramServer
	}	
}
