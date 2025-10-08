import {User as JWTUser} from '@loopback/authentication-jwt';
import {hasMany, model, property} from '@loopback/repository';
import {getModelSchemaRef} from '@loopback/rest';
import {ROLES} from '../types';
import {UserToken} from './user-token.model';
@model({
  settings: {
    allowExtendedOperators: true,
    mysql: {
      table: 'users'
    },
  },
})
export class User extends JWTUser {

  @property({
    type: 'string',
    required: true
  })
  username?: string | undefined;


  @property({
    type: 'string',
    required: true,
    hidden: true,
    jsonSchema: {
      minimum: 8,
      errorMessage: {
        minimum: 'A senha precisa ser no mínimo de 8 caracteres'
      }
    }
  })
  password: string;

  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {
      columnName: 'created_at',
    }
  })
  createdAt?: Date;
  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {
      columnName: 'updated_at',
    }
  })
  updatedAt?: Date;

  @hasMany(() => UserToken)
  userTokens: UserToken[];

  @property({
    type: 'string',
    id: true,
    jsonSchema: {
      enum: [ROLES.ADMIN]
    }
  })
  role: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

export const createModelScheme = getModelSchemaRef(User, {
  title: 'NewUser',
  exclude: ['id', 'createdAt', 'updatedAt', 'verificationToken', 'emailVerified']
})
export const updateModelScheme = getModelSchemaRef(User, {
  title: 'NewUser',
  exclude: ['id', 'createdAt', 'updatedAt'],
  partial: true
})
