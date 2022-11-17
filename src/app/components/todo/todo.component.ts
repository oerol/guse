import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  TODO_LIST = [{ title: 'Write a review on Goodreads' }, { title: 'Do some research on the author' }];
  GOALS_LIST = [{ title: 'Read 10 pages' }];

  constructor() {}

  ngOnInit(): void {}
}
