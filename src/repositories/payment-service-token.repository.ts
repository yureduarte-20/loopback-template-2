import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AppDatasourceDataSource} from '../datasources';
import {PaymentServiceToken, PaymentServiceTokenRelations} from '../models';

export class PaymentServiceTokenRepository extends DefaultCrudRepository<
  PaymentServiceToken,
  typeof PaymentServiceToken.prototype.id,
  PaymentServiceTokenRelations
> {
  constructor(
    @inject('datasources.AppDatasource') dataSource: AppDatasourceDataSource,
  ) {
    super(PaymentServiceToken, dataSource);
  }
}
