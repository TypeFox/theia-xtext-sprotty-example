package io.typefox.examples.theia.states.ide.diagram

import io.typefox.examples.theia.states.states.State
import io.typefox.examples.theia.states.states.StateMachine
import io.typefox.examples.theia.states.states.Transition
import org.eclipse.sprotty.LayoutOptions
import org.eclipse.sprotty.SEdge
import org.eclipse.sprotty.SGraph
import org.eclipse.sprotty.SLabel
import org.eclipse.sprotty.SNode
import org.eclipse.sprotty.xtext.IDiagramGenerator

class StatesDiagramGenerator implements IDiagramGenerator {
	
	override generate(Context context) {
		(context.resource.contents.head as StateMachine).toSGraph(context)
	}
	
	def toSGraph(StateMachine sm, extension Context context) {
		new SGraph [
			id = idCache.uniqueId(sm, sm.name)
			children = (sm.states.map[toSNode(context)] 
					  + sm.states.map[transitions].flatten.map[toSEdge(context)]
			).toList 
		]
	}
	
	def SNode toSNode(State state, extension Context context) {
		val theId = idCache.uniqueId(state, state.name) 
		new SNode [
			id = theId
			children =  #[
				new SLabel [
					id = idCache.uniqueId(theId + '.label')
					text = state.name 
				]
			]
			layout = 'stack'
			layoutOptions = new LayoutOptions [
				paddingTop = 10.0
				paddingBottom = 10.0
				paddingLeft = 10.0
				paddingRight = 10.0
				
			]
		]
	}
	
	def SEdge toSEdge(Transition transition, extension Context context) {
		new SEdge [
			sourceId = idCache.getId(transition.eContainer) 
			targetId = idCache.getId(transition.state)
			val theId = idCache.uniqueId(transition, sourceId + ':' + transition.event.name + ':' + targetId)
			id = theId 
			children = #[
				new SLabel [
					id = idCache.uniqueId(theId + '.label')
					type = 'label'
					text = transition.event.name
				]
			]
		]
	}
}