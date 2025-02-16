import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: true, // Ensure this is present
})
export class ArticleComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {

  }
}
