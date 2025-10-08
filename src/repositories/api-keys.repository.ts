import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, EntityNotFoundError, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {AppDatasourceDataSource} from '../datasources';
import {ApiKeys, ApiKeysRelations, MailRequest} from '../models';
import {MailRequestRepository} from './mail-request.repository';

export class ApiKeysRepository extends DefaultCrudRepository<
  ApiKeys,
  typeof ApiKeys.prototype.id,
  ApiKeysRelations
> {

  public readonly mailRequests: HasManyRepositoryFactory<MailRequest, typeof ApiKeys.prototype.id>;

  constructor(
    @inject('datasources.AppDatasource') dataSource: AppDatasourceDataSource, @repository.getter('MailRequestRepository') protected mailRequestRepositoryGetter: Getter<MailRequestRepository>,
  ) {
    super(ApiKeys, dataSource);
    this.mailRequests = this.createHasManyRepositoryFactoryFor('mailRequests', mailRequestRepositoryGetter,);
    this.registerInclusionResolver('mailRequests', this.mailRequests.inclusionResolver);
  }
  public async findOrFail(hash: string, revoked: boolean = false): Promise<(ApiKeys & ApiKeysRelations)> {
    const model = await this.findOne({
      where: {key: hash, revoked}
    })
    if (!model) throw new EntityNotFoundError(ApiKeys, 'apiKey');
    return model;
  }
}
