import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AlertService } from '../../alert/alert.service';
import { AuthService, PerfilUsuario } from '../../auth/auth.service';
import { CanComponentDeactivate } from '../../auth/unsaved-changes.guard';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-usuario.page.html',
  styleUrl: './cadastro-usuario.page.scss'
})
export class CadastroUsuarioPage implements CanComponentDeactivate {
  form: FormGroup;
  formAlterado = false;

  perfis: PerfilUsuario[] = ['ADMIN', 'OPERADOR'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alert: AlertService
  ) {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.maxLength(60)]],
        senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(120)]],
        confirmarSenha: ['', [Validators.required]],
        perfil: ['OPERADOR', Validators.required]
      },
      { validators: this.senhasIguaisValidator }
    );

    this.form.valueChanges.subscribe(() => {
      this.formAlterado = true;
    });
  }

  private senhasIguaisValidator(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirmar = group.get('confirmarSenha')?.value;
    if (senha && confirmar && senha !== confirmar) {
      return { senhasDiferentes: true };
    }
    return null;
  }

  temAlteracoes(): boolean {
    return this.formAlterado || this.form.dirty;
  }

  limparEstadoAlterado(): void {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.formAlterado = false;
  }

  podeSair(): boolean | Promise<boolean> {
    return !this.temAlteracoes();
  }

  cadastrar(): void {
    if (this.form.invalid) {
      this.alert.warn('Campos obrigatórios', 'Preencha todos os campos corretamente.');
      return;
    }

    const { username, senha, perfil } = this.form.value;

    this.authService.register({ username, senha, perfil }).subscribe({
      next: () => {
        this.alert
          .success('Cadastro realizado', 'Usuário criado com sucesso. Você já pode fazer login.')
          .then(() => {
            this.limparEstadoAlterado();
            this.router.navigate(['/login']);
          });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao cadastrar usuário', err);
        const mensagem = this.extrairMensagemErro(err);
        this.alert.error('Erro ao cadastrar', mensagem);
      }
    });
  }

  cancelar(): void {
    if (this.temAlteracoes()) {
      this.alert
        .confirm('Descartar alterações?', 'Os dados não salvos serão perdidos.')
        .then((res) => {
          if (res.isConfirmed) {
            this.limparEstadoAlterado();
            this.router.navigate(['/login']);
          }
        });
    } else {
      this.router.navigate(['/login']);
    }
  }

  private extrairMensagemErro(err: HttpErrorResponse): string {
    if (err.error) {
      if (typeof err.error === 'string') return err.error;
      if (err.error.message) return err.error.message;
      if (err.error.fieldErrors) {
        const mensagens = Object.values(err.error.fieldErrors as Record<string, string>);
        if (mensagens.length > 0) return mensagens[0];
      }
    }
    if (err.status === 0) return 'Não foi possível conectar ao servidor.';
    return 'Erro ao processar a requisição.';
  }
}
