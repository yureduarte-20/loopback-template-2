import {UserService as LoopbackUserService} from '@loopback/authentication';
import {Credentials} from '@loopback/authentication-jwt';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';

import {User} from '../models/user.model';
import {UserRepository} from '../repositories';
import {HasherService} from './hasher.service';

export class UserService implements LoopbackUserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(HasherService)
    public hash: HasherService
  ) { }
  async verifyCredentials(credentials: Credentials): Promise<User> {
    const user = await this.userRepository.findByEmail(credentials.email);
    const data = await this.hash.verifyPassword(user.password, credentials.password)
    if (!data) throw new HttpErrors.Unauthorized('Senha incorreta')
    return user;
  }
  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id!.toString(),
      email: user.email,
      name: user.name,
      role: null
    }
  }
  async createAUser(user: Omit<User, 'id'>) {
    user.password = await this.hash.genHashPassword(user.password)
    return this.userRepository.create(user);
  }
}
