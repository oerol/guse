import { Component, OnInit } from '@angular/core';
import { Todo } from './todo';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  TODO_LIST: Todo[] = [
    { title: 'Write a review on Goodreads', ticked: true },
    { title: 'Do some research on the author', ticked: false },
  ];
  GOALS_LIST = [{ title: 'Read 10 pages', ticked: false }];

  constructor() {}

  ngOnInit(): void {}

  getClassName = (todo: Todo) => {
    let className = 'todo-item';

    if (todo.ticked) {
      className += ' ' + 'ticked';
    }

    return className;
  };

  tickTodoItem = (todoItemIndex: number) => {
    this.TODO_LIST[todoItemIndex].ticked = !this.TODO_LIST[todoItemIndex].ticked;
  };
  tickGoalItem = (goalItemIndex: number) => {
    this.GOALS_LIST[goalItemIndex].ticked = !this.GOALS_LIST[goalItemIndex].ticked;
  };
}
