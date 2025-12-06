import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../auth/auth.service';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBar {
  userName = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserNome() ?? 'Usuário';
  }

  logout(): void {
    this.alert
      .confirm('Sair do sistema', 'Deseja realmente sair?')
      .then(result => {
        if (result.isConfirmed) {
          this.authService.logout();
          this.router.navigate(['/login']);
          this.alert.success('Sessão encerrada', 'Você saiu do sistema.');
        }
      });
  }
}
