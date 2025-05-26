import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    allowExtendedOperators: true,

  }
})
export class PaymentServiceToken extends Entity {
  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'access_token'
    }
  })
  accessToken: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'token_type'
    }
  })
  tokenType: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'token_id'
    },
    index: {
      unique: true
    }
  })
  tokenId: string;

  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {
      columnName: 'updated_at'
    }
  })
  updatedAt?: Date;

  @property({
    type: 'date',
    mysql: {
      columnName: 'expires_at'
    }
  })
  expiresAt?: Date;

  constructor(data?: Partial<PaymentServiceToken>) {
    super(data);
  }
}

export interface PaymentServiceTokenRelations {
  // describe navigational properties here
}

export type PaymentServiceTokenWithRelations = PaymentServiceToken & PaymentServiceTokenRelations;
