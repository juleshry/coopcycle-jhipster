import { IUser } from 'app/entities/user/user.model';

export interface ICoursier {
  id?: number;
  name?: string;
  surname?: string;
  transportMean?: string;
  phone?: string;
  user?: IUser | null;
}

export class Coursier implements ICoursier {
  constructor(
    public id?: number,
    public name?: string,
    public surname?: string,
    public transportMean?: string,
    public phone?: string,
    public user?: IUser | null
  ) {}
}

export function getCoursierIdentifier(coursier: ICoursier): number | undefined {
  return coursier.id;
}
