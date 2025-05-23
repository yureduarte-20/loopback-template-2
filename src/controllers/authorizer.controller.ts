// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {get} from '@loopback/rest';
import {ROLES} from '../types';

// import {inject} from '@loopback/core';

@authenticate("jwt")
export class AuthorizerController {
  constructor() { }
  @get('/admins')
  @authorize({allowedRoles: [ROLES.ADMIN]})
  public admim() {

    return {
      message: 'apenas admins'
    }
  }
  @get('/finances')
  @authorize({allowedRoles: [ROLES.FINANCES]})
  public finances() {
    return {
      message: 'apenas admins'
    }
  }
}
