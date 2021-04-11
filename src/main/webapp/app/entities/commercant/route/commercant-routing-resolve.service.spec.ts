jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICommercant, Commercant } from '../commercant.model';
import { CommercantService } from '../service/commercant.service';

import { CommercantRoutingResolveService } from './commercant-routing-resolve.service';

describe('Service Tests', () => {
  describe('Commercant routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CommercantRoutingResolveService;
    let service: CommercantService;
    let resultCommercant: ICommercant | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CommercantRoutingResolveService);
      service = TestBed.inject(CommercantService);
      resultCommercant = undefined;
    });

    describe('resolve', () => {
      it('should return ICommercant returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCommercant = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCommercant).toEqual({ id: 123 });
      });

      it('should return new ICommercant if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCommercant = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCommercant).toEqual(new Commercant());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCommercant = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCommercant).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
