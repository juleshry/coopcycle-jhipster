import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICoursier, Coursier } from '../coursier.model';

import { CoursierService } from './coursier.service';

describe('Service Tests', () => {
  describe('Coursier Service', () => {
    let service: CoursierService;
    let httpMock: HttpTestingController;
    let elemDefault: ICoursier;
    let expectedResult: ICoursier | ICoursier[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CoursierService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        surname: 'AAAAAAA',
        transportMean: 'AAAAAAA',
        phone: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Coursier', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Coursier()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Coursier', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            surname: 'BBBBBB',
            transportMean: 'BBBBBB',
            phone: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Coursier', () => {
        const patchObject = Object.assign(
          {
            surname: 'BBBBBB',
            transportMean: 'BBBBBB',
          },
          new Coursier()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Coursier', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            surname: 'BBBBBB',
            transportMean: 'BBBBBB',
            phone: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Coursier', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCoursierToCollectionIfMissing', () => {
        it('should add a Coursier to an empty array', () => {
          const coursier: ICoursier = { id: 123 };
          expectedResult = service.addCoursierToCollectionIfMissing([], coursier);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(coursier);
        });

        it('should not add a Coursier to an array that contains it', () => {
          const coursier: ICoursier = { id: 123 };
          const coursierCollection: ICoursier[] = [
            {
              ...coursier,
            },
            { id: 456 },
          ];
          expectedResult = service.addCoursierToCollectionIfMissing(coursierCollection, coursier);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Coursier to an array that doesn't contain it", () => {
          const coursier: ICoursier = { id: 123 };
          const coursierCollection: ICoursier[] = [{ id: 456 }];
          expectedResult = service.addCoursierToCollectionIfMissing(coursierCollection, coursier);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(coursier);
        });

        it('should add only unique Coursier to an array', () => {
          const coursierArray: ICoursier[] = [{ id: 123 }, { id: 456 }, { id: 33433 }];
          const coursierCollection: ICoursier[] = [{ id: 123 }];
          expectedResult = service.addCoursierToCollectionIfMissing(coursierCollection, ...coursierArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const coursier: ICoursier = { id: 123 };
          const coursier2: ICoursier = { id: 456 };
          expectedResult = service.addCoursierToCollectionIfMissing([], coursier, coursier2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(coursier);
          expect(expectedResult).toContain(coursier2);
        });

        it('should accept null and undefined values', () => {
          const coursier: ICoursier = { id: 123 };
          expectedResult = service.addCoursierToCollectionIfMissing([], null, coursier, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(coursier);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
