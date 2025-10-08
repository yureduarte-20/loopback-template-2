import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {JWTAuthenticationComponent, TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';
import {AuthorizationComponent, AuthorizationDecision, AuthorizationOptions, AuthorizationTags} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import dot from 'dotenv';
import path from 'path';
import {NodemailerBindings, nodemailerConfig} from './config/mail.config';
import {MySequence} from './sequence';
import {AuthorizationProvider, UserService} from './services';
import {NodemailerService} from './services/mail.service'; // Nome da classe atualizado
import {ApiKeyStrategy} from './strategies/ApiKeyStrategy';

export {ApplicationConfig};

export class TemplateApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    dot.config()
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, ApiKeyStrategy);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(process.env.TOKEN_SECRET as string)
    this.bind(UserServiceBindings.USER_SERVICE).toClass(UserService)
    this.setupBindings();
    const optionsAuthorize: AuthorizationOptions = {
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    };

    const binding = this.component(AuthorizationComponent);
    this.configure(binding.key).to(optionsAuthorize);
    this
      .bind('authorizationProviders.my-authorizer-provider')
      .toProvider(AuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
  setupBindings(): void {
    // 1. Vincular a configuração do Nodemailer
    this.bind(NodemailerBindings.CONFIG).to(nodemailerConfig);
    // 2. Vincular a classe do serviço de E-mail
    this.bind(NodemailerBindings.EMAIL_SERVICE).toClass(NodemailerService);
  }
}
