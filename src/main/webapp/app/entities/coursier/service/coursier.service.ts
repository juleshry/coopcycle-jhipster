import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICoursier, getCoursierIdentifier } from '../coursier.model';

export type EntityResponseType = HttpResponse<ICoursier>;
export type EntityArrayResponseType = HttpResponse<ICoursier[]>;

@Injectable({ providedIn: 'root' })
export class CoursierService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/coursiers');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(coursier: ICoursier): Observable<EntityResponseType> {
    return this.http.post<ICoursier>(this.resourceUrl, coursier, { observe: 'response' });
  }

  update(coursier: ICoursier): Observable<EntityResponseType> {
    return this.http.put<ICoursier>(`${this.resourceUrl}/${getCoursierIdentifier(coursier) as number}`, coursier, { observe: 'response' });
  }

  partialUpdate(coursier: ICoursier): Observable<EntityResponseType> {
    return this.http.patch<ICoursier>(`${this.resourceUrl}/${getCoursierIdentifier(coursier) as number}`, coursier, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICoursier>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICoursier[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCoursierToCollectionIfMissing(coursierCollection: ICoursier[], ...coursiersToCheck: (ICoursier | null | undefined)[]): ICoursier[] {
    const coursiers: ICoursier[] = coursiersToCheck.filter(isPresent);
    if (coursiers.length > 0) {
      const coursierCollectionIdentifiers = coursierCollection.map(coursierItem => getCoursierIdentifier(coursierItem)!);
      const coursiersToAdd = coursiers.filter(coursierItem => {
        const coursierIdentifier = getCoursierIdentifier(coursierItem);
        if (coursierIdentifier == null || coursierCollectionIdentifiers.includes(coursierIdentifier)) {
          return false;
        }
        coursierCollectionIdentifiers.push(coursierIdentifier);
        return true;
      });
      return [...coursiersToAdd, ...coursierCollection];
    }
    return coursierCollection;
  }
}
