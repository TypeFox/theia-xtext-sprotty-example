package io.typefox.examples.theia.states.ide.launch

import org.eclipse.sprotty.xtext.launch.DiagramServerSocketLauncher

class StatesSocketServer extends DiagramServerSocketLauncher {

	override createSetup() {
		new StatesLanguageServerSetup
	}

	def static void main(String... args) {
		new StatesSocketServer().run(args)
	}
}
