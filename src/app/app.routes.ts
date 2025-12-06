// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Páginas
import { LoginPage } from './pages/login/login.page';
import { HomePage } from './pages/home/home.page';
import { MotoristaPage } from './pages/motorista/motorista.page';
import { CaminhaoPage } from './pages/caminhao/caminhao.page';
import { BairroPontoPage } from './pages/bairro-ponto/bairro-ponto.page';
import { ConexaoPage } from './pages/conexao/conexao.page';
import { RotaPage } from './pages/rota/rota.page';
import { ItinerarioPage } from './pages/itinerario/itinerario.page';
import { CadastroUsuarioPage } from './pages/cadastro-usuario/cadastro-usuario.page';

// Guards
import { authGuard } from './auth/auth.guard';
import { adminGuard } from './auth/admin.guard';
import { operadorGuard } from './auth/operador.guard';
import { unsavedChangesGuard } from './auth/unsaved-changes.guard';

export const routes: Routes = [
  // rota padrão → redireciona para login (sem guard)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // login público
  { path: 'login', component: LoginPage },

  // home protegida
  { path: 'home', component: HomePage, canActivate: [authGuard] },

  // cadastro de usuário público (só unsaved-changes)
  {
    path: 'cadastro-usuario',
    component: CadastroUsuarioPage,
    canDeactivate: [unsavedChangesGuard]
  },

  // MOTORISTA (somente ADMIN, com unsaved-changes)
  {
    path: 'motorista',
    component: MotoristaPage,
    canActivate: [authGuard, adminGuard],
    canDeactivate: [unsavedChangesGuard]
  },

  // CAMINHÃO (somente ADMIN, com unsaved-changes)
  {
    path: 'caminhao',
    component: CaminhaoPage,
    canActivate: [authGuard, adminGuard],
    canDeactivate: [unsavedChangesGuard]
  },

  // BAIRRO / PONTOS (ADMIN + OPERADOR, com unsaved-changes)
  {
    path: 'bairro',
    component: BairroPontoPage,
    canActivate: [authGuard, operadorGuard],
    canDeactivate: [unsavedChangesGuard]
  },

  // CONEXÕES ENTRE BAIRROS (ADMIN + OPERADOR, com unsaved-changes)
  {
    path: 'conexao',
    component: ConexaoPage,
    canActivate: [authGuard, operadorGuard],
    canDeactivate: [unsavedChangesGuard]
  },

  // ROTAS (ADMIN + OPERADOR, com unsaved-changes)
  {
    path: 'rota',
    component: RotaPage,
    canActivate: [authGuard, operadorGuard],
    canDeactivate: [unsavedChangesGuard]
  },

  // ITINERÁRIOS (ADMIN + OPERADOR, com unsaved-changes)
  {
    path: 'itinerario',
    component: ItinerarioPage,
    canActivate: [authGuard, operadorGuard],
    canDeactivate: [unsavedChangesGuard]
  },

  // rota coringa
  { path: '**', redirectTo: 'login' }
];
