import { IUser } from 'app/entities/user/user.model';

export interface IClient {
  id?: number;
  name?: string;
  surname?: string;
  address?: string;
  phone?: string;
  user?: IUser | null;
}

export class Client implements IClient {
  constructor(
    public id?: number,
    public name?: string,
    public surname?: string,
    public address?: string,
    public phone?: string,
    public user?: IUser | null
  ) {}
}

export function getClientIdentifier(client: IClient): number | undefined {
  return client.id;
}
