import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import axios from 'axios';
import dotenv from 'dotenv';
import {PaymentBag, PaymentService} from '../interfaces/payment-service';
import {PaymentServiceToken} from '../models';
import {PaymentServiceTokenRepository} from '../repositories';
dotenv.config()
export type HotmartResponseToken = {
  "access_token": string,
  "token_type": string,
  "expires_in": number,
  "scope": string,
  "jti": string
}
@injectable({scope: BindingScope.TRANSIENT})
export class HotmartService implements PaymentService {
  private url: string = 'https://sandbox.hotmart.com/payments';
  private api: Axios.AxiosInstance;
  private HOTMART_CLIENT_ID = process.env.HOTMART_CLIENT_ID as string;
  private HOTMART_CLIENT_SECRET = process.env.HOTMART_CLIENT_SECRET as string;
  private HOTMART_HEADER = process.env.HOTMART_HEADER as string;
  constructor(
    @repository(PaymentServiceTokenRepository) public paymentServiceToken: PaymentServiceTokenRepository
  ) {
    this.api = axios.create({
      baseURL: this.url
    })
  }

  async getSubscriptions(): Promise<any> {
    const token = await this.getAccessToken();
    return this.api.get('/api/v1/subscriptions', {
      headers: {
        Authorization: `${token.tokenType.charAt(0).toUpperCase() + token.tokenType.slice(1)} ${token.accessToken}`
      }
    })
  }
  webhookReturn(data: PaymentBag): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getAccessToken(): Promise<PaymentServiceToken> {
    const token = await this.paymentServiceToken.findOne({where: {expiresAt: {gt: new Date()}}})
    if (token) return token;
    const {data} = await axios.get<HotmartResponseToken>(`https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials&client_id=${this.HOTMART_CLIENT_ID}&client_secret=${this.HOTMART_CLIENT_SECRET}`, {
      headers: {
        Authorization: this.HOTMART_HEADER
      }
    })
    return this.paymentServiceToken.create({
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + (data.expires_in * 1000)),
      tokenId: data.jti,
      tokenType: data.token_type
    })
  };

}
