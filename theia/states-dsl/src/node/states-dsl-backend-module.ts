import { ContainerModule } from 'inversify';
import { LanguageServerContribution } from '@theia/languages/lib/node';
import { StatesLanguageServerContribution } from './states-dsl-language-server-contribution';

export default new ContainerModule(bind => {
    bind(LanguageServerContribution).to(StatesLanguageServerContribution).inSingletonScope();
});
