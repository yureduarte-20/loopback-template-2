import {PaymentServiceToken} from '../models';

export interface PaymentService {
  getSubscriptions(): Promise<any>;
  webhookReturn(data: PaymentBag): Promise<void>;
  getAccessToken(): Promise<PaymentServiceToken>
}
export interface PaymentBag {
  uniqueId: string;
  data: any;
}
