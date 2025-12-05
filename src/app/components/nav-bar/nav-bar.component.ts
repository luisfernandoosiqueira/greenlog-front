import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBar {
  userName: string = '';
  //funcionario: UsuarioResponse | null = null;

  //constructor(private authService: LoginService, private router: Router) {}
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Busca o usuário do LocalStorage
    /*
    this.funcionario = this.authService.getUsuarioLogado();

    if (this.funcionario) {
      this.userName = this.funcionario.nome;
    }
  }

  logout() {
    console.log('Usuário saiu do sistema');
    this.authService.logout();
    this.router.navigate(['/login']);
  }*/
  this.userName = "Admin";
  }
  logout(){}
}

