import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICoursier } from '../coursier.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { CoursierService } from '../service/coursier.service';
import { CoursierDeleteDialogComponent } from '../delete/coursier-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-coursier',
  templateUrl: './coursier.component.html',
})
export class CoursierComponent implements OnInit {
  coursiers: ICoursier[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected coursierService: CoursierService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.coursiers = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.coursierService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ICoursier[]>) => {
          this.isLoading = false;
          this.paginateCoursiers(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.coursiers = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICoursier): number {
    return item.id!;
  }

  delete(coursier: ICoursier): void {
    const modalRef = this.modalService.open(CoursierDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.coursier = coursier;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateCoursiers(data: ICoursier[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.coursiers.push(d);
      }
    }
  }
}
