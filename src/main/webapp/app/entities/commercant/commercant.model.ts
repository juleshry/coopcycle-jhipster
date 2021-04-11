import { IUser } from 'app/entities/user/user.model';

export interface ICommercant {
  id?: number;
  companyName?: string;
  address?: string;
  phone?: string;
  user?: IUser | null;
}

export class Commercant implements ICommercant {
  constructor(
    public id?: number,
    public companyName?: string,
    public address?: string,
    public phone?: string,
    public user?: IUser | null
  ) {}
}

export function getCommercantIdentifier(commercant: ICommercant): number | undefined {
  return commercant.id;
}
