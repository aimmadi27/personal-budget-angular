import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class HeroComponent {

}
