package io.typefox.examples.theia.states.formatting2

import com.google.inject.Inject
import io.typefox.examples.theia.states.tests.StatesInjectorProvider
import org.eclipse.xtext.testing.InjectWith
import org.eclipse.xtext.testing.extensions.InjectionExtension
import org.eclipse.xtext.testing.formatter.FormatterTestHelper
import org.eclipse.xtext.testing.formatter.FormatterTestRequest
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.^extension.ExtendWith

@ExtendWith(InjectionExtension)
@InjectWith(StatesInjectorProvider)
class StatesFormatterTest {

	@Inject
	extension FormatterTestHelper

	@Test
	def void format_01() {
		checkFormatter[
			toBeFormatted = '''
				    
				    
				    
				    statemachine 
				    
				    mrsGrantsSecretCompartment
				
						event doorClosed
						event drawOpened
				event    lightOn
				event panelClosed    
				
				state    active   
				lightOn     =>     waitingForDraw   
				drawOpened => waitingForLight
				
				/**
				 * This is comment.
				 */state idle doorClosed => active state waitingForLight lightOn => idle state waitingForDraw drawOpened => unlockedPanel state unlockedPanel panelClosed => idle
			'''
			expectation = '''
				statemachine mrsGrantsSecretCompartment
				
				event doorClosed
				event drawOpened
				event lightOn
				event panelClosed
				
				state active
					lightOn => waitingForDraw
					drawOpened => waitingForLight
				
				/**
				 * This is comment.
				 */
				state idle
					doorClosed => active
				
				state waitingForLight
					lightOn => idle
				
				state waitingForDraw
					drawOpened => unlockedPanel
				
				state unlockedPanel
					panelClosed => idle
			'''.spacesToTabs
		]
	}

	private def checkFormatter((FormatterTestRequest)=>void init) {
		assertFormatted[
			init.apply(it)
			useSerializer = false
		]
	}

	private def String spacesToTabs(CharSequence it) {
		return it.toString.replaceAll('    ', '\t');
	}

}
