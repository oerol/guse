import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Todo } from '../components/todo/todo';
import { DayService } from './day.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  TODO_LIST: Todo[] = [
    { title: 'Write a review on Goodreads', ticked: true },
    { title: 'Do some research on the author', ticked: false },
  ];
  GOALS_LIST = [{ title: 'Read 10 pages', ticked: false }];

  activeBoxIndex = 0;

  startEndTime = '';

  activeBoxChange: Subject<any> = new Subject<any>();

  constructor(private dayService: DayService) {
    this.getStartEndTimeForActiveBox();
  }

  getStartEndTimeForActiveBox = () => {
    this.startEndTime = this.dayService.getStartEndOfBox(this.activeBoxIndex);
  };

  changeActiveBox = (boxIndex: number) => {
    this.activeBoxIndex = boxIndex;
    this.getStartEndTimeForActiveBox();
    this.activeBoxChange.next(this.startEndTime);
  };
}
