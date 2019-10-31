package io.typefox.examples.theia.states.formatting2

import com.google.inject.Inject
import io.typefox.examples.theia.states.services.StatesGrammarAccess
import io.typefox.examples.theia.states.states.Event
import io.typefox.examples.theia.states.states.State
import io.typefox.examples.theia.states.states.StateMachine
import io.typefox.examples.theia.states.states.Transition
import org.eclipse.xtext.formatting2.AbstractFormatter2
import org.eclipse.xtext.formatting2.IFormattableDocument
import org.eclipse.xtext.formatting2.IHiddenRegionFormatter
import org.eclipse.xtext.xbase.lib.Procedures.Procedure1

import static io.typefox.examples.theia.states.states.StatesPackage.Literals.*

class StatesFormatter extends AbstractFormatter2 {

	static val Procedure1<IHiddenRegionFormatter> NEW_LINE = [setNewLines(1, 1, 2)]
	static val Procedure1<IHiddenRegionFormatter> TWO_LINES = [setNewLines(2, 2, 2)]
	static val Procedure1<IHiddenRegionFormatter> SPACE = [oneSpace]
	static val Procedure1<IHiddenRegionFormatter> TAB = [space = '\n\t']
	static val Procedure1<IHiddenRegionFormatter> NO_SPACE = [noSpace]

	@Inject extension StatesGrammarAccess

	def dispatch void format(StateMachine it, extension IFormattableDocument doc) {
		regionFor.keyword(stateMachineAccess.statemachineKeyword_0).prepend(NO_SPACE).append(SPACE)
		eContents.forEach[format]
	}

	def dispatch void format(Event it, extension IFormattableDocument doc) {
		regionFor.keyword(eventAccess.eventKeyword_0).prepend(NEW_LINE).append(SPACE)
	}

	def dispatch void format(State it, extension IFormattableDocument doc) {
		regionFor.keyword(stateAccess.stateKeyword_0).prepend(TWO_LINES).append(SPACE)
		eContents.forEach[format]
	}

	def dispatch void format(Transition it, extension IFormattableDocument doc) {
		regionFor.feature(TRANSITION__EVENT).prepend(TAB).append(SPACE)
		regionFor.keyword('=>').surround(SPACE)
	}

// TODO: implement for 
}
