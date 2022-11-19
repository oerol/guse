import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Box } from '../components/day/box';
import { Todo } from '../components/todo/todo';
import { DayService } from './day.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  TODO_LIST: Todo[] = [
    { activity: 'meditate', title: 'Write a review on Goodreads', ticked: true },
    { activity: 'meditate', title: 'Do some research on the author', ticked: false },
  ];
  GOALS_LIST: Todo[] = [{ activity: 'meditate', title: 'Read 10 pages', ticked: false }];

  activeBoxIndex = 0;
  activeBox: Box;

  startEndTime = '';

  activeBoxChange: Subject<any> = new Subject<any>();

  constructor(private dayService: DayService) {
    this.getStartEndTimeForActiveBox();
    this.activeBox = dayService.boxes[this.activeBoxIndex];
  }

  getStartEndTimeForActiveBox = () => {
    this.startEndTime = this.dayService.getStartEndOfBox(this.activeBoxIndex);
  };

  changeActiveBox = (boxIndex: number) => {
    this.activeBoxIndex = boxIndex;
    this.getStartEndTimeForActiveBox();
    this.dayService.boxes[boxIndex];
    this.activeBoxChange.next(this.startEndTime);
  };
}
