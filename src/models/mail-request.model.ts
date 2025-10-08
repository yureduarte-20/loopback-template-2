import {belongsTo, Entity, model, property} from '@loopback/repository';
import {ApiKeys} from './api-keys.model';

@model({
  settings: {
    allowExtendedOperators: true,

    mysql: {
      table: 'mail_requests'
    },
    foreignKeys: {
      fk_api_keys__mail_request: {
        name: 'fk_api_keys__mail_request',
        entity: 'MailRequest',
        entityKey: 'id',
        foreignKey: 'apiKeysId',
      },
    },
  }
})
export class MailRequest extends Entity {
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
  to: string;

  @property({
    type: 'string',
    required: true,
  })
  subject: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      dataType: 'text',
    }
  })
  html: string;

  @belongsTo(() => ApiKeys, {}, {
    mysql: {
      columnName: 'api_key_id'
    }
  })
  apiKeysId: number;

  constructor(data?: Partial<MailRequest>) {
    super(data);
  }
}

export interface MailRequestRelations {
  // describe navigational properties here
}

export type MailRequestWithRelations = MailRequest & MailRequestRelations;
