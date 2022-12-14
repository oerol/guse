import { Component, OnInit } from '@angular/core';
import { DayService } from 'src/app/services/day.service';
import { TodoService } from 'src/app/services/todo.service';
import { Box } from '../day/box';
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

  activeBox: Box;

  _subscription: any;

  constructor(private todoService: TodoService, private dayService: DayService) {
    this.TODO_LIST = todoService.TODO_LIST;
    this.GOALS_LIST = todoService.GOALS_LIST;
    this.startEndTime = todoService.startEndTime;
    this.activeBox = todoService.activeBox;

    this._subscription = todoService.activeBoxChange.subscribe((value) => {
      this.startEndTime = value;
      console.log(todoService.TODO_LIST);
      this.TODO_LIST = todoService.TODO_LIST;
      this.GOALS_LIST = todoService.GOALS_LIST;
    });
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

  creatingNewTask = false;

  initiateNewTask = () => {
    if (this.todoService.activeBox) {
      this.creatingNewTask = true;
    } else {
      alert('Please select a box first by clicking on it!');
    }
  };

  createNewTask = (e: Event) => {
    let title = (e.target as HTMLElement).innerText;
    this.TODO_LIST.push({ activity: '', ticked: false, title });
    this.creatingNewTask = false;
  };
}
