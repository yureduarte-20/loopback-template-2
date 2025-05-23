import {inject} from '@loopback/core';
import {DefaultCrudRepository, EntityNotFoundError} from '@loopback/repository';
import {AppDatasourceDataSource} from '../datasources';
import {ApiKeys, ApiKeysRelations} from '../models';

export class ApiKeysRepository extends DefaultCrudRepository<
  ApiKeys,
  typeof ApiKeys.prototype.id,
  ApiKeysRelations
> {
  constructor(
    @inject('datasources.AppDatasource') dataSource: AppDatasourceDataSource,
  ) {
    super(ApiKeys, dataSource);
  }
  public async findOrFail(hash: string, revoked: boolean = false): Promise<(ApiKeys & ApiKeysRelations)> {
    const model = await this.findOne({
      where: {key: hash, revoked}
    })
    if (!model) throw new EntityNotFoundError(ApiKeys, 'apiKey');
    return model;
  }
}
