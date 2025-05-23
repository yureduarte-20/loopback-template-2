import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
@injectable({scope: BindingScope.TRANSIENT})
export class HasherService {
  constructor(/* Add @inject to inject parameters */) { }
  public async genHashPassword(content: string): Promise<string> {
    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(content, salt);
    return hash;
  }
  public async verifyPassword(hash: string, password: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  public sha256(content: string | Buffer): string {
    return crypto.createHmac('sha256', process.env.TOKEN_SECRET as string)
      .update(content)
      .digest('hex');
  }
  public verifySha256(content: string | Buffer, hash: string): boolean {
    const _hash = Buffer.from(hash);
    const hash_content = crypto.createHmac('sha256', process.env.TOKEN_SECRET as string)
      .update(content)
      .digest();
    return crypto.timingSafeEqual(hash_content, _hash)
  }
}
