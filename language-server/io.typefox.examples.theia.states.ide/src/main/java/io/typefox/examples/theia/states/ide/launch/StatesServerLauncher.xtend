package io.typefox.examples.theia.states.ide.launch

import org.eclipse.sprotty.xtext.launch.DiagramServerLauncher

class StatesServerLauncher extends DiagramServerLauncher {
	
	override createSetup() {
		new StatesLanguageServerSetup
	}

	def static void main(String[] args) {
		new StatesServerLauncher().run(args)
	}
}
