import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import bcrypt from 'bcrypt';
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
}
