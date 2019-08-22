package io.typefox.examples.theia.states.ide.hover

import com.google.common.collect.ImmutableList
import io.typefox.examples.theia.states.states.Event
import io.typefox.examples.theia.states.states.State
import org.eclipse.emf.ecore.EObject
import org.eclipse.xtext.ide.server.hover.HoverService

class StatesHoverService extends HoverService {

	override getContents(EObject element) {
		val builder = ImmutableList.builder.addAll(super.getContents(element));
		if (element instanceof State) {
			builder.add('''State: «element.name»''');
		} else if (element instanceof Event) {
			builder.add('''Event: «element.name»''');
		}
		return builder.build;
	}

}
