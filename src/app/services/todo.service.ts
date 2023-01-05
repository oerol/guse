import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Box } from '../components/day/box';
import { Todo } from '../components/todo/todo';
import { DayService } from './day.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  TODO_LIST_ALL: Todo[] = [
    { activity: 'read', title: 'Write a review on Goodreads', ticked: true },
    { activity: 'read', title: 'Do some research on the author', ticked: false },
    { activity: 'work', title: 'Ask the team for a review', ticked: true },
  ];
  GOALS_LIST_ALL: Todo[] = [
    { activity: 'read', title: 'Read 10 pages', ticked: false },
    { activity: 'meditate', title: 'Meditate for 10 minutes', ticked: false },
  ];

  TODO_LIST: Todo[] = [];
  GOALS_LIST: Todo[] = [];

  activeBoxIndex = 0;
  activeBox!: Box;

  startEndTime = '';

  activeBoxChange: Subject<any> = new Subject<any>();

  constructor(private dayService: DayService) {}

  getStartEndTimeForActiveBox = () => {
    this.startEndTime = this.dayService.getStartEndOfBox(this.activeBoxIndex);
  };

  changeActiveBox = (boxIndex: number) => {
    this.activeBoxIndex = boxIndex;
    this.activeBox = this.dayService.boxes[this.activeBoxIndex];

    this.getTodosForCurrentActivity();
    this.getStartEndTimeForActiveBox();

    this.activeBoxChange.next(this.startEndTime);
  };

  clearActiveBox = () => {
    this.activeBoxIndex = 0;
    this.activeBox = {} as Box;

    this.getTodosForCurrentActivity();
    this.startEndTime = '';

    this.activeBoxChange.next(this.startEndTime);
  };

  getTodosForCurrentActivity = () => {
    this.TODO_LIST = this.TODO_LIST_ALL.filter((todoItem) => this.activeBox.title === todoItem.activity);
    this.GOALS_LIST = this.GOALS_LIST_ALL.filter((goalItem) => this.activeBox.title === goalItem.activity);
  };
}
