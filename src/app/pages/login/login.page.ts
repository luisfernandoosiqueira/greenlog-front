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
    if (authError) {
      this.alert.warn('Acesso negado', 'Faça login para continuar.');
    }
  }

  private extrairMensagemErro(err: HttpErrorResponse): string {
    if (err.error) {
      if (typeof err.error === 'string') {
        return err.error;
      }

      if (err.error.message) {
        return err.error.message;
      }

      if (err.error.fieldErrors) {
        const fieldErrors = err.error.fieldErrors as Record<string, string>;
        const mensagens = Object.values(fieldErrors);
        if (mensagens.length > 0) {
          return mensagens[0];
        }
      }
    }

    if (err.status === 0) {
      return 'Não foi possível conectar ao servidor.';
    }

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
            const destino = this.redirectUrl || '/';
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
