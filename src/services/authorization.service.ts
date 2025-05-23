import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';
import { /* inject, */ BindingScope, injectable, Provider} from '@loopback/core';

/*
 * Fix the service type. Possible options can be:
 * - import {Authorization} from 'your-module';
 * - export type Authorization = string;
 * - export interface Authorization {}
 */
export type Authorization = unknown;

@injectable({scope: BindingScope.TRANSIENT})
export class AuthorizationProvider implements Provider<Authorizer> {
  constructor(/* Add @inject to inject parameters */) { }


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
    const clientRole = authorizationCtx.principals[0].role;
    const allowedRoles = metadata.allowedRoles;
    return allowedRoles!.includes(clientRole)
      ? AuthorizationDecision.ALLOW
      : AuthorizationDecision.DENY;
  }
}
