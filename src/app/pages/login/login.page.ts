import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    const dadosLogin = this.loginForm.value;
    console.log("Enviando login:", dadosLogin);

    this.authService.login(dadosLogin).subscribe({
      next: (res) => {
        console.log("Resposta do backend:", res);

        if (res.success) {
          this.errorMessage = "";
          this.router.navigate(['']);
        } else {
          this.errorMessage = "Usuário ou senha inválidos.";
        }
      },

      error: (err) => {
        console.error("Erro na requisição:", err);
        this.errorMessage = "Erro ao tentar fazer login. Tente novamente.";
      }
    });
  }
}
