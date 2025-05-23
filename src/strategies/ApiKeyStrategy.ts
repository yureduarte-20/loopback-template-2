import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, RedirectRoute, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {ApiKeysRepository} from '../repositories';
import {HasherService} from '../services';

export class ApiKeyStrategy implements AuthenticationStrategy {
  name = "api-key";
  constructor(
    @service(HasherService)
    public hasher: HasherService,
    @repository(ApiKeysRepository)
    public apiKeyRepository: ApiKeysRepository
  ) {

  }
  async authenticate(request: Request): Promise<UserProfile | RedirectRoute | undefined> {

    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) throw new HttpErrors.BadRequest('Api-Key Header is required');
    const apiKeyModel = await this.getApiKey(apiKey);
    const profile: UserProfile = {
      name: apiKeyModel.name,
      [securityId]: apiKeyModel.id!.toString(),
      profileType: 'ApiKey'
    };
    return profile;
  }
  public async getApiKey(apiKey: string) {
    const hash = this.hasher.sha256(apiKey);
    return await this.apiKeyRepository.findOrFail(hash);
  }
}
