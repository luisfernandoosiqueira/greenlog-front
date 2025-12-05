import { Component } from '@angular/core';
import { NavBar } from "../../components/nav-bar/nav-bar.component";
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NavBar, FooterComponent, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {

}
