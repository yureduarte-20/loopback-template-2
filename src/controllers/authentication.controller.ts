// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  TokenServiceBindings,
  UserRepository,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {createModelScheme} from '../models';
import {User as ApplicationUser} from '../models/user.model';
import {UserTokenRepository} from '../repositories';
import {HasherService, UserService} from '../services';
export class AuthenticationController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @service(HasherService)
    public hashService: HasherService,
    @repository(UserTokenRepository)
    public tokenRepository: UserTokenRepository,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    public expiration: string
  ) { }
  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(ApplicationUser)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: createModelScheme,
        },
      },
    })
    user: Omit<ApplicationUser, 'id'>,
  ): Promise<ApplicationUser> {
    return this.userService.createAUser(user);
  }
  @post('/login')
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string'
              },

            },
            required: ['email', 'password']
          },
        },
      },
    })
    credential: Credentials,
  ) {
    const user = await this.userService.verifyCredentials(credential);
    const profile = this.userService.convertToUserProfile(user)
    const token = await this.jwtService.generateToken(profile)
    const expiresIn = new Date(Date.now() + (parseInt(this.expiration) * 1000))
    await this.tokenRepository.create({
      userId: user.id,
      token: token,
      expiresIn
    })
    return {token}
  }
  @get('/me')
  @authenticate("jwt")
  public async me() {
    return this.userRepository.findById(this.user[securityId])
  }
}


