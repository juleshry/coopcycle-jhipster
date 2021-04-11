jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICoursier, Coursier } from '../coursier.model';
import { CoursierService } from '../service/coursier.service';

import { CoursierRoutingResolveService } from './coursier-routing-resolve.service';

describe('Service Tests', () => {
  describe('Coursier routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CoursierRoutingResolveService;
    let service: CoursierService;
    let resultCoursier: ICoursier | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CoursierRoutingResolveService);
      service = TestBed.inject(CoursierService);
      resultCoursier = undefined;
    });

    describe('resolve', () => {
      it('should return ICoursier returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCoursier = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCoursier).toEqual({ id: 123 });
      });

      it('should return new ICoursier if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCoursier = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCoursier).toEqual(new Coursier());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCoursier = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCoursier).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
