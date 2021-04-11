import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICommercant, Commercant } from '../commercant.model';

import { CommercantService } from './commercant.service';

describe('Service Tests', () => {
  describe('Commercant Service', () => {
    let service: CommercantService;
    let httpMock: HttpTestingController;
    let elemDefault: ICommercant;
    let expectedResult: ICommercant | ICommercant[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CommercantService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        companyName: 'AAAAAAA',
        address: 'AAAAAAA',
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

      it('should create a Commercant', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Commercant()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Commercant', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            companyName: 'BBBBBB',
            address: 'BBBBBB',
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

      it('should partial update a Commercant', () => {
        const patchObject = Object.assign(
          {
            address: 'BBBBBB',
            phone: 'BBBBBB',
          },
          new Commercant()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Commercant', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            companyName: 'BBBBBB',
            address: 'BBBBBB',
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

      it('should delete a Commercant', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCommercantToCollectionIfMissing', () => {
        it('should add a Commercant to an empty array', () => {
          const commercant: ICommercant = { id: 123 };
          expectedResult = service.addCommercantToCollectionIfMissing([], commercant);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(commercant);
        });

        it('should not add a Commercant to an array that contains it', () => {
          const commercant: ICommercant = { id: 123 };
          const commercantCollection: ICommercant[] = [
            {
              ...commercant,
            },
            { id: 456 },
          ];
          expectedResult = service.addCommercantToCollectionIfMissing(commercantCollection, commercant);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Commercant to an array that doesn't contain it", () => {
          const commercant: ICommercant = { id: 123 };
          const commercantCollection: ICommercant[] = [{ id: 456 }];
          expectedResult = service.addCommercantToCollectionIfMissing(commercantCollection, commercant);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(commercant);
        });

        it('should add only unique Commercant to an array', () => {
          const commercantArray: ICommercant[] = [{ id: 123 }, { id: 456 }, { id: 76799 }];
          const commercantCollection: ICommercant[] = [{ id: 123 }];
          expectedResult = service.addCommercantToCollectionIfMissing(commercantCollection, ...commercantArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const commercant: ICommercant = { id: 123 };
          const commercant2: ICommercant = { id: 456 };
          expectedResult = service.addCommercantToCollectionIfMissing([], commercant, commercant2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(commercant);
          expect(expectedResult).toContain(commercant2);
        });

        it('should accept null and undefined values', () => {
          const commercant: ICommercant = { id: 123 };
          expectedResult = service.addCommercantToCollectionIfMissing([], null, commercant, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(commercant);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
