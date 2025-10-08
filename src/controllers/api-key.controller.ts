import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {randomBytes} from 'crypto';
import {ApiKeys, createDefinition} from '../models/api-keys.model';
import {ApiKeysRepository} from '../repositories';
import {HasherService} from '../services';
import {ROLES} from '../types';
@authenticate("jwt")
@authorize({
  allowedRoles: [
    ROLES.ADMIN
  ]
})
export class ApiKeyController {
  constructor(
    @repository(ApiKeysRepository)
    public apiKeysRepository: ApiKeysRepository,
    @service(HasherService)
    public hashService: HasherService
  ) { }

  @post('/api-keys')
  @response(200, {
    description: 'ApiKeys model instance',
    content: {'application/json': {schema: getModelSchemaRef(ApiKeys)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: createDefinition,
        },
      },
    })
    apiKeys: Omit<ApiKeys, 'id'>,
  ): Promise<ApiKeys> {
    apiKeys.key = randomBytes(32).toString('hex');
    const model = await this.apiKeysRepository.create({...apiKeys, key: this.hashService.sha256(apiKeys.key)});
    model.key = apiKeys.key;
    return model;
  }

  @get('/api-keys/count')
  @response(200, {
    description: 'ApiKeys model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ApiKeys) where?: Where<ApiKeys>,
  ): Promise<Count> {
    return this.apiKeysRepository.count(where);
  }

  @get('/api-keys')
  @response(200, {
    description: 'Array of ApiKeys model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ApiKeys, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ApiKeys) filter?: Filter<ApiKeys>,
  ): Promise<ApiKeys[]> {
    return this.apiKeysRepository.find(filter);
  }

  @get('/api-keys/{key}')
  @response(200, {
    description: 'ApiKeys model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ApiKeys, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('key') id: string,
    @param.filter(ApiKeys, {exclude: 'where'}) filter?: FilterExcludingWhere<ApiKeys>
  ): Promise<ApiKeys> {
    id = this.hashService.sha256(id);
    return this.apiKeysRepository.findOrFail(id);
  }

  @patch('/api-keys/{id}')
  @response(204, {
    description: 'ApiKeys PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ApiKeys, {partial: true}),
        },
      },
    })
    apiKeys: ApiKeys,
  ): Promise<void> {
    await this.apiKeysRepository.updateById(id, apiKeys);
  }

  @put('/api-keys/{id}')
  @response(204, {
    description: 'ApiKeys PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() apiKeys: ApiKeys,
  ): Promise<void> {
    await this.apiKeysRepository.replaceById(id, apiKeys);
  }

  @del('/api-keys/{id}')
  @response(204, {
    description: 'ApiKeys DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.apiKeysRepository.deleteById(id);
  }
}
