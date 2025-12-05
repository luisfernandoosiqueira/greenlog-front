import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { HomePage } from './pages/home/home.page';
import { MotoristaPage } from './pages/motorista/motorista.page';
import { CaminhaoPage } from './pages/caminhao/caminhao.page';
import { BairroPontoPage } from './pages/bairro-ponto/bairro-ponto.page';
import { ConexaoPage } from './pages/conexao/conexao.page';
import { RotaPage } from './pages/rota/rota.page';
import { ItinerarioPage } from './pages/itinerario/itinerario.page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'login', component: LoginPage },
    { path: 'motorista', component: MotoristaPage},
    { path: 'caminhao', component: CaminhaoPage},
    { path: 'bairro', component: BairroPontoPage},
    { path: 'conexao', component: ConexaoPage},
    { path: 'rota', component: RotaPage},
    { path: 'itinerario', component: ItinerarioPage}
];
