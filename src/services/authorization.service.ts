import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {securityId} from '@loopback/security';
import {UserRepository} from '../repositories';


export class AuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
  ) { }


  /**
   * @returns authenticateFn
   */
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {

    const id = authorizationCtx.principals[0][securityId];
    const type = authorizationCtx.principals[0]['type']
    if (type == 'USER') {
      const clientRole = (await this.userRepository.findById(id)).role;
      const allowedRoles = metadata.allowedRoles;
      return allowedRoles!.includes(clientRole)
        ? AuthorizationDecision.ALLOW
        : AuthorizationDecision.DENY;
    } else if (type == 'ApiKey') {
      return AuthorizationDecision.ALLOW;
    }
    return AuthorizationDecision.DENY;
  }
}
