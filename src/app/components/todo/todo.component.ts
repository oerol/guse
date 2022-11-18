import { Component, OnInit } from '@angular/core';
import { DayService } from 'src/app/services/day.service';
import { TodoService } from 'src/app/services/todo.service';
import { Todo } from './todo';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  TODO_LIST: Todo[];
  GOALS_LIST: Todo[];

  startEndTime: string;

  constructor(private todoService: TodoService, private dayService: DayService) {
    this.TODO_LIST = todoService.TODO_LIST;
    this.GOALS_LIST = todoService.GOALS_LIST;
    this.startEndTime = todoService.startEndTime;
  }

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
