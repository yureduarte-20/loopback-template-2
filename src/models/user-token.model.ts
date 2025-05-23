import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model({
  settings: {
    allowExtendedOperators: true,
    mysql: {
      table: 'user_tokens',
    },
    foreignKeys: {
      fk_users__tokens_user_id: {
        name: 'fk_users__tokens_user_id',
        entity: 'User',
        entityKey: 'id',
        foreignKey: 'userId'
      }
    }
  }
})
export class UserToken extends Entity {
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
  token: string;
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
    type: 'date',
    required: true,
    mysql: {
      columnName: 'expires_in'
    }
  })
  expiresIn: Date;

  @belongsTo(() => User, {}, {
    required: true,
    mysql: {
      columnName: 'user_id'
    }
  })
  userId: string;

  constructor(data?: Partial<UserToken>) {
    super(data);
  }
}

export interface UserTokenRelations {
  // describe navigational properties here
}

export type UserTokenWithRelations = UserToken & UserTokenRelations;
