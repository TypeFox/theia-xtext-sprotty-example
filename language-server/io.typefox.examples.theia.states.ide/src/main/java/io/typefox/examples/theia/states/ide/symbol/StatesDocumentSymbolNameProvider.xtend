package io.typefox.examples.theia.states.ide.symbol

import io.typefox.examples.theia.states.states.Transition
import org.eclipse.emf.ecore.EObject
import org.eclipse.xtext.ide.server.symbol.DocumentSymbolMapper.DocumentSymbolNameProvider
import org.eclipse.xtext.naming.QualifiedName
import org.eclipse.xtext.resource.IEObjectDescription

import static io.typefox.examples.theia.states.states.StatesPackage.Literals.*

class StatesDocumentSymbolNameProvider extends DocumentSymbolNameProvider {

	override getName(EObject it) {
		if (it instanceof Transition) {
			return '''«event.name» => «state.name»''';
		}
		return super.getName(it);
	}

	override getName(IEObjectDescription it) {
		if (EClass === TRANSITION) {
			val transition = EObjectOrProxy;
			if (!transition.eIsProxy) {
				return transition.name;
			}
		}
		return super.getName(it);
	}

	override protected getName(QualifiedName it) {
		if (it !== null && segmentCount > 1) {
			return lastSegment;
		}
		return super.getName(it);
	}

}
