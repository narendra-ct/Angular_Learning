import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Gamification';

  constructor(private router: Router) {

  }
  onLogoClick(){
    this.router.navigate(['./'])
  }
}
