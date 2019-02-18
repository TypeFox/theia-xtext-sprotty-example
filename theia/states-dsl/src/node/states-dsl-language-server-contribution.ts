import { isWindows } from '@theia/core/lib/common/os';
import { BaseLanguageServerContribution, IConnection } from '@theia/languages/lib/node';
import { injectable } from 'inversify';
import * as net from 'net';
import { join, resolve } from 'path';
import { createSocketConnection } from 'vscode-ws-jsonrpc/lib/server';
import { STATES_LANGUAGE_SERVER_ID, STATES_LANGUAGE_SERVER_NAME } from '../common';

const EXECUTABLE_NAME = isWindows ? 'states-language-server.bat' : 'states-language-server';
const EXECUTABLE_PATH = resolve(join(__dirname, '..', '..', 'build', 'states-language-server', 'bin', EXECUTABLE_NAME));

@injectable()
export class StatesLanguageServerContribution extends BaseLanguageServerContribution {

    readonly id = STATES_LANGUAGE_SERVER_ID;
    readonly name = STATES_LANGUAGE_SERVER_NAME;

    getPort(): number | undefined {
        let arg = process.argv.filter(arg => arg.startsWith('--STATES_LSP='))[0];
        if (!arg) {
            return undefined;
        } else {
            return Number.parseInt(arg.substring('--STATES_LSP='.length), 10);
        }
    }

    start(clientConnection: IConnection): void {
        let socketPort = this.getPort();
        if (socketPort) {
            const socket = new net.Socket();
            socket.connect(socketPort);
            const serverConnection = createSocketConnection(socket, socket, () => {
                socket.destroy();
            });
            this.forward(clientConnection, serverConnection);
        } else {
            const args: string[] = [];
            const serverConnection = this.createProcessStreamConnection(EXECUTABLE_PATH, args);
            this.forward(clientConnection, serverConnection);
        }
    }
}
