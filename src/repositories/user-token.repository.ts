import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {AppDatasourceDataSource} from '../datasources';
import {UserToken, UserTokenRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class UserTokenRepository extends DefaultCrudRepository<
  UserToken,
  typeof UserToken.prototype.id,
  UserTokenRelations
> {

  public readonly user: BelongsToAccessor<User, typeof UserToken.prototype.id>;

  constructor(
    @inject('datasources.AppDatasource') dataSource: AppDatasourceDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserToken, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
