import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  standalone: true, // Ensure this is present
  imports: [RouterModule],
})
export class BreadcrumbsComponent {

}
