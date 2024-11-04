import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      },
      {
        path: 'biblioteca',
        loadChildren: () => import('./biblioteca/biblioteca.module').then( m => m.BibliotecaPageModule)
      },
      {
        path: 'recomendaciones',
        loadChildren: () => import('./recomendaciones/recomendaciones.module').then( m => m.RecomendacionesPageModule)
      },
      {
        path: 'mis-listas',
        loadChildren: () => import('./mis-listas/mis-listas.module').then( m => m.MisListasPageModule)
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule {}
