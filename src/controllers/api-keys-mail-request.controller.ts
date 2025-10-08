import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {securityId, UserProfile} from '@loopback/security';

import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors, // Adicionado HttpErrors
  param,
  post,
  requestBody
} from '@loopback/rest';

import {inject} from '@loopback/core';
import {NodemailerBindings} from '../config/mail.config';
import {
  MailRequest
} from '../models';
import {ApiKeysRepository, MailRequestRepository} from '../repositories';
import {NodemailerService} from '../services/mail.service';

@authenticate("api-key")
export class ApiKeysMailRequestController {
  constructor(
    @repository(ApiKeysRepository) protected apiKeysRepository: ApiKeysRepository,
    @inject(NodemailerBindings.EMAIL_SERVICE) private mailService: NodemailerService,
    @inject(AuthenticationBindings.CURRENT_USER) private user: UserProfile,
    @repository(MailRequestRepository) private mailRequestRepository: MailRequestRepository
  ) { }

  @get('/mail-requests', {
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
    @param.query.object('filter') filter?: Filter<MailRequest>,
  ): Promise<MailRequest[]> {
    return this.apiKeysRepository.mailRequests(+this.user[securityId]).find(filter);
  }

  @post('/mail-request', {
    responses: {
      '200': {
        description: 'ApiKeys model instance',
        content: {'application/json': {schema: getModelSchemaRef(MailRequest)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MailRequest, {
            title: 'NewMailRequestInApiKeys',
            exclude: ['id', 'apiKeysId', 'info', 'status'],
            optional: ['apiKeysId']
          }),
        },
      },
    }) mailRequest: Omit<MailRequest, 'id' | 'apiKeysId' | 'info' | 'status'>,
  ): Promise<MailRequest> {
    console.log(+this.user[securityId])
    const mailRequestCreate = await this.mailRequestRepository.create({
      apiKeysId: +this.user[securityId],
      status: 'pending',
      ...mailRequest
    });
    this.mailService.sendMail(
      {subject: mailRequest.subject, html: mailRequest.html, to: mailRequest.to}
    )
      .then(async (info: any) => {
        await this.mailRequestRepository.updateById(mailRequestCreate.id, {
          status: 'finished',
          info
        })
      })
      .catch(async (e) => {
        await this.mailRequestRepository.updateById(mailRequestCreate.id, {
          status: 'failed',
          info: e
        })
      })

    return mailRequestCreate
  }

  // ===== INÍCIO DA NOVA OPERAÇÃO GET POR ID =====
  @get('/mail-requests/{id}', {
    responses: {
      '200': {
        description: 'MailRequest model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(MailRequest, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: number,
  ): Promise<MailRequest> {
    const result = await this.apiKeysRepository.mailRequests(+this.user[securityId]).find({
      where: {id},
    });

    if (!result.length) {
      throw new HttpErrors.NotFound(
        `MailRequest with id ${id} not found.`,
      );
    }
    return result[0];
  }
  // ===== FIM DA NOVA OPERAÇÃO GET POR ID =====

  @del('mail-requests', {
    responses: {
      '200': {
        description: 'ApiKeys.MailRequest DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.query.object('where', getWhereSchemaFor(MailRequest)) where?: Where<MailRequest>,
  ): Promise<Count> {
    return this.apiKeysRepository.mailRequests(+this.user[securityId]).delete(where);
  }
}
