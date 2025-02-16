import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class MenuComponent {}

