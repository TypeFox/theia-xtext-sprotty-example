const shell = require('shelljs')
const fs = require('fs');

const version  = process.argv[2];

function setTheiaVersion(pkgJsonFile, version) {
	if (!/(^|\/)node_modules\//.test(pkgJsonFile)) {
		shell.echo(`Setting @theia version to ${version} in ${pkgJsonFile}`)
		const content = fs.readFileSync(pkgJsonFile).toString()
		const newContent = content
			.replace(/("@theia\/[^"]*":)\s*"(latest|next)"/g, `$1 "${version}"`)
			.replace(/("theia-sprotty":)\s*"(latest|next)"/g, `$1 "${version}"`)
		fs.writeFileSync(pkgJsonFile, newContent)
	}
} 

if (!version || ['next', 'latest'].indexOf(version.trim()) < 0) {
	shell.echo(`Sets the version of the @theia extension dependencies in the package.json files.`)
	shell.echo() 
	shell.echo('Usage:')
	shell.echo("sh theia-version.sh '<next|latest>'")
} else {
	shell.ls('-R')
		.filter(f => f.endsWith('package.json'))
		.forEach(f => setTheiaVersion(f, version.trim()))
}
