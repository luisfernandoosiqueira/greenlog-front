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
  // raiz → login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // login público
  { path: 'login', component: LoginPage },

  // home protegida
  { path: 'home', component: HomePage, canActivate: [authGuard] },

  // cadastro de usuário
  {
    path: 'cadastro-usuario',
    component: CadastroUsuarioPage,
    canDeactivate: [unsavedChangesGuard]
  },

  // motorista (admin)
  {
    path: 'motorista',
    component: MotoristaPage,
    canActivate: [authGuard, adminGuard],
    canDeactivate: [unsavedChangesGuard]
  },

  // caminhão (admin)
  {
    path: 'caminhao',
    component: CaminhaoPage,
    canActivate: [authGuard, adminGuard],
    canDeactivate: [unsavedChangesGuard]
  },

  // bairro / pontos (admin ou operador)
  {
    path: 'bairro',
    component: BairroPontoPage,
    canActivate: [authGuard, operadorGuard],
    canDeactivate: [unsavedChangesGuard]
  },

  // conexões (admin ou operador)
  {
    path: 'conexao',
    component: ConexaoPage,
    canActivate: [authGuard, operadorGuard],
    canDeactivate: [unsavedChangesGuard]
  },

  // rotas (admin ou operador)
  {
    path: 'rota',
    component: RotaPage,
    canActivate: [authGuard, operadorGuard],
    canDeactivate: [unsavedChangesGuard]
  },

  // itinerários (admin ou operador)
  {
    path: 'itinerario',
    component: ItinerarioPage,
    canActivate: [authGuard, operadorGuard],
    canDeactivate: [unsavedChangesGuard]
  },

  // coringa → home (guard decide se manda pro login)
  { path: '**', redirectTo: 'home' }
];
