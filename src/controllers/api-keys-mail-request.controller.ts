import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';

import {inject} from '@loopback/core';
import {NodemailerBindings} from '../config/mail.config';
import {
  ApiKeys,
  MailRequest,
} from '../models';
import {ApiKeysRepository} from '../repositories';
import {NodemailerService} from '../services/mail.service';
@authenticate("api-key")
export class ApiKeysMailRequestController {
  constructor(
    @repository(ApiKeysRepository) protected apiKeysRepository: ApiKeysRepository,
    @inject(NodemailerBindings.EMAIL_SERVICE) private mailService: NodemailerService
  ) { }

  @get('/api-keys/{id}/mail-requests', {
    responses: {
      '200': {
        description: 'Array of ApiKeys has many MailRequest',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(MailRequest)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<MailRequest>,
  ): Promise<MailRequest[]> {
    return this.apiKeysRepository.mailRequests(id).find(filter);
  }

  @post('/api-keys/{id}/mail-requests', {
    responses: {
      '200': {
        description: 'ApiKeys model instance',
        content: {'application/json': {schema: getModelSchemaRef(MailRequest)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof ApiKeys.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MailRequest, {
            title: 'NewMailRequestInApiKeys',
            exclude: ['id'],
            optional: ['apiKeysId']
          }),
        },
      },
    }) mailRequest: Omit<MailRequest, 'id'>,
  ): Promise<MailRequest> {
    this.mailService.sendMail(
      mailRequest
    )
      .then(() => console.log('Enviou'))
      .catch((e) => console.error(e))
    return this.apiKeysRepository.mailRequests(id).create(mailRequest);
  }

  @patch('/api-keys/{id}/mail-requests', {
    responses: {
      '200': {
        description: 'ApiKeys.MailRequest PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MailRequest, {partial: true}),
        },
      },
    })
    mailRequest: Partial<MailRequest>,
    @param.query.object('where', getWhereSchemaFor(MailRequest)) where?: Where<MailRequest>,
  ): Promise<Count> {
    return this.apiKeysRepository.mailRequests(id).patch(mailRequest, where);
  }

  @del('/api-keys/{id}/mail-requests', {
    responses: {
      '200': {
        description: 'ApiKeys.MailRequest DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(MailRequest)) where?: Where<MailRequest>,
  ): Promise<Count> {
    return this.apiKeysRepository.mailRequests(id).delete(where);
  }
}
