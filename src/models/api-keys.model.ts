import {Entity, model, property} from '@loopback/repository';
import {getModelSchemaRef} from '@loopback/rest';

@model({
  settings: {
    mysql: {
      table: 'api_keys'
    }
  }
})
export class ApiKeys extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,

  })
  name: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    }
  })
  key: string;
  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {
      columnName: 'created_at'
    }
  })

  createdAt?: Date;
  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {
      columnName: 'updated_at'
    }
  })
  updatedAt?: Date;
  @property({
    type: 'boolean',
    default: false
  })
  revoked: boolean

  constructor(data?: Partial<ApiKeys>) {
    super(data);
  }
}

export interface ApiKeysRelations {
  // describe navigational properties here
}

export type ApiKeysWithRelations = ApiKeys & ApiKeysRelations;

export const createDefinition = getModelSchemaRef(ApiKeys, {
  exclude: ['createdAt', 'updatedAt', 'revoked', 'id', 'key']
})
