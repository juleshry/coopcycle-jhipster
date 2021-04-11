import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'client',
        data: { pageTitle: 'coopcycleApp.client.home.title' },
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'coursier',
        data: { pageTitle: 'coopcycleApp.coursier.home.title' },
        loadChildren: () => import('./coursier/coursier.module').then(m => m.CoursierModule),
      },
      {
        path: 'commercant',
        data: { pageTitle: 'coopcycleApp.commercant.home.title' },
        loadChildren: () => import('./commercant/commercant.module').then(m => m.CommercantModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
