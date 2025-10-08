import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {AppDatasourceDataSource} from '../datasources';
import {MailRequest, MailRequestRelations, ApiKeys} from '../models';
import {ApiKeysRepository} from './api-keys.repository';

export class MailRequestRepository extends DefaultCrudRepository<
  MailRequest,
  typeof MailRequest.prototype.id,
  MailRequestRelations
> {

  public readonly apiKeys: BelongsToAccessor<ApiKeys, typeof MailRequest.prototype.id>;

  constructor(
    @inject('datasources.AppDatasource') dataSource: AppDatasourceDataSource, @repository.getter('ApiKeysRepository') protected apiKeysRepositoryGetter: Getter<ApiKeysRepository>,
  ) {
    super(MailRequest, dataSource);
    this.apiKeys = this.createBelongsToAccessorFor('apiKeys', apiKeysRepositoryGetter,);
    this.registerInclusionResolver('apiKeys', this.apiKeys.inclusionResolver);
  }
}
