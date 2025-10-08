import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  MailRequest,
  ApiKeys,
} from '../models';
import {MailRequestRepository} from '../repositories';

export class MailRequestApiKeysController {
  constructor(
    @repository(MailRequestRepository)
    public mailRequestRepository: MailRequestRepository,
  ) { }

  @get('/mail-requests/{id}/api-keys', {
    responses: {
      '200': {
        description: 'ApiKeys belonging to MailRequest',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ApiKeys),
          },
        },
      },
    },
  })
  async getApiKeys(
    @param.path.number('id') id: typeof MailRequest.prototype.id,
  ): Promise<ApiKeys> {
    return this.mailRequestRepository.apiKeys(id);
  }
}
