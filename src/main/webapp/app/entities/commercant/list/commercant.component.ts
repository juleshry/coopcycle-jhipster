import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICommercant } from '../commercant.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { CommercantService } from '../service/commercant.service';
import { CommercantDeleteDialogComponent } from '../delete/commercant-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-commercant',
  templateUrl: './commercant.component.html',
})
export class CommercantComponent implements OnInit {
  commercants: ICommercant[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected commercantService: CommercantService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.commercants = [];
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

    this.commercantService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ICommercant[]>) => {
          this.isLoading = false;
          this.paginateCommercants(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.commercants = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICommercant): number {
    return item.id!;
  }

  delete(commercant: ICommercant): void {
    const modalRef = this.modalService.open(CommercantDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.commercant = commercant;
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

  protected paginateCommercants(data: ICommercant[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.commercants.push(d);
      }
    }
  }
}
