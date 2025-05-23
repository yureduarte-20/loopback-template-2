import {Getter, inject} from '@loopback/core';
import {DataObject, DefaultCrudRepository, EntityNotFoundError, HasManyRepositoryFactory, Options, repository} from '@loopback/repository';
import {AppDatasourceDataSource} from '../datasources';
import {User, UserRelations, UserToken} from '../models';
import {UserTokenRepository} from './user-token.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly userTokens: HasManyRepositoryFactory<UserToken, typeof User.prototype.id>;

  constructor(
    @inject('datasources.AppDatasource') dataSource: AppDatasourceDataSource, @repository.getter('UserTokenRepository') protected userTokenRepositoryGetter: Getter<UserTokenRepository>,
  ) {
    super(User, dataSource);
    this.userTokens = this.createHasManyRepositoryFactoryFor('userTokens', userTokenRepositoryGetter,);
    this.registerInclusionResolver('userTokens', this.userTokens.inclusionResolver);
  }
  public updateById(id: string, data: DataObject<User>, options?: Options): Promise<void> {
    data.updatedAt = new Date();
    return super.updateById(id, data, options)
  }
  public update(entity: User, options?: Options): Promise<void> {
    entity.updatedAt = new Date();
    return super.update(entity, options)
  }
  public replaceById(id: string, data: DataObject<User>, options?: Options): Promise<void> {
    data.updatedAt = new Date();
    return super.replaceById(id, data, options)
  }
  public async findByEmail(email: typeof User.prototype.email): Promise<User> {
    const user = await this.findOne({where: {email: email}});
    if (!user) throw new EntityNotFoundError(User, email)
    return user;
  }
}
