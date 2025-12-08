import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../auth/auth.service';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  private redirectUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      senha: ['', Validators.required]
    });

    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect');
    const authError = this.route.snapshot.queryParamMap.get('authError');

    // alerta só quando veio redirecionado pelo guard
    if (authError && this.redirectUrl) {
      this.alert.warn('Acesso negado', 'Faça login para continuar.');
    }
  }

  // tenta reaproveitar ao máximo a mensagem vinda do backend
  private extrairMensagemErro(err: HttpErrorResponse): string {
    if (err.error) {
      // back devolvendo string simples
      if (typeof err.error === 'string') {
        return err.error;
      }

      // objeto com message (padrão do seu back)
      if ((err.error as any).message) {
        return (err.error as any).message;
      }

      // eventualmente algum back pode mandar "error" descritivo
      if ((err.error as any).error && typeof (err.error as any).error === 'string') {
        return (err.error as any).error;
      }

      // objeto com fieldErrors no padrão { campo: "mensagem" }
      if ((err.error as any).fieldErrors) {
        const fieldErrors = err.error.fieldErrors as Record<string, string>;
        const mensagens = Object.values(fieldErrors);
        if (mensagens.length > 0) {
          return mensagens[0];
        }
      }
    }

    // erro de rede / servidor fora do ar
    if (err.status === 0) {
      return 'Não foi possível conectar ao servidor.';
    }

    // fallback genérico
    return 'Erro ao tentar fazer login. Tente novamente.';
  }

  login(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      this.alert.warn('Campos obrigatórios', 'Informe usuário e senha.');
      return;
    }

    const { username, senha } = this.loginForm.value;

    this.authService.login({ username, senha }).subscribe({
      next: (usuario) => {
        this.errorMessage = '';
        this.alert
          .success('Bem-vindo', `Login realizado com sucesso, ${usuario.username}.`)
          .then(() => {
            const destino = this.redirectUrl || '/home';
            this.router.navigateByUrl(destino);
          });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro na requisição:', err);
        const mensagem = this.extrairMensagemErro(err);
        this.errorMessage = mensagem;
        this.alert.error('Erro no login', mensagem);
      }
    });
  }
}
