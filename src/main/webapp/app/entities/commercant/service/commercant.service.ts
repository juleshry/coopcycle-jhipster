import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICommercant, getCommercantIdentifier } from '../commercant.model';

export type EntityResponseType = HttpResponse<ICommercant>;
export type EntityArrayResponseType = HttpResponse<ICommercant[]>;

@Injectable({ providedIn: 'root' })
export class CommercantService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/commercants');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(commercant: ICommercant): Observable<EntityResponseType> {
    return this.http.post<ICommercant>(this.resourceUrl, commercant, { observe: 'response' });
  }

  update(commercant: ICommercant): Observable<EntityResponseType> {
    return this.http.put<ICommercant>(`${this.resourceUrl}/${getCommercantIdentifier(commercant) as number}`, commercant, {
      observe: 'response',
    });
  }

  partialUpdate(commercant: ICommercant): Observable<EntityResponseType> {
    return this.http.patch<ICommercant>(`${this.resourceUrl}/${getCommercantIdentifier(commercant) as number}`, commercant, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICommercant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICommercant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCommercantToCollectionIfMissing(
    commercantCollection: ICommercant[],
    ...commercantsToCheck: (ICommercant | null | undefined)[]
  ): ICommercant[] {
    const commercants: ICommercant[] = commercantsToCheck.filter(isPresent);
    if (commercants.length > 0) {
      const commercantCollectionIdentifiers = commercantCollection.map(commercantItem => getCommercantIdentifier(commercantItem)!);
      const commercantsToAdd = commercants.filter(commercantItem => {
        const commercantIdentifier = getCommercantIdentifier(commercantItem);
        if (commercantIdentifier == null || commercantCollectionIdentifiers.includes(commercantIdentifier)) {
          return false;
        }
        commercantCollectionIdentifiers.push(commercantIdentifier);
        return true;
      });
      return [...commercantsToAdd, ...commercantCollection];
    }
    return commercantCollection;
  }
}
