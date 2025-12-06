import { Routes } from '@angular/router';

import { LoginPage } from './pages/login/login.page';
import { HomePage } from './pages/home/home.page';
import { MotoristaPage } from './pages/motorista/motorista.page';
import { CaminhaoPage } from './pages/caminhao/caminhao.page';
import { BairroPontoPage } from './pages/bairro-ponto/bairro-ponto.page';
import { ConexaoPage } from './pages/conexao/conexao.page';
import { RotaPage } from './pages/rota/rota.page';
import { ItinerarioPage } from './pages/itinerario/itinerario.page';

import { authGuard } from './auth/auth.guard';
import { adminGuard } from './auth/admin.guard';
import { operadorGuard } from './auth/operador.guard';
import { unsavedChangesGuard } from './auth/unsaved-changes.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage },

  {
    path: '',
    component: HomePage,
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'motorista',
    component: MotoristaPage,
    canActivate: [authGuard, adminGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'caminhao',
    component: CaminhaoPage,
    canActivate: [authGuard, adminGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'bairro',
    component: BairroPontoPage,
    canActivate: [authGuard, operadorGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'conexao',
    component: ConexaoPage,
    canActivate: [authGuard, operadorGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'rota',
    component: RotaPage,
    canActivate: [authGuard, operadorGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'itinerario',
    component: ItinerarioPage,
    canActivate: [authGuard, operadorGuard],
    canDeactivate: [unsavedChangesGuard]
  }
];
