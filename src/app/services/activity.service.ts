import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  ACTIVITY_ITEMS = [
    { category: 'Read', name: 'Notes' },
    { category: 'Passion', name: 'Chess' },
    { category: 'Health', name: 'Run' },
    { category: 'Read', name: 'C&P' },
    { category: 'Read', name: 'Educated' },
    { category: 'Music', name: 'Piano' },
    { category: 'Productivity', name: 'Code' },
    { category: 'Language', name: 'English' },
    { category: 'Health', name: 'Gym' },
    { category: 'Productivity', name: 'Journal' },
    { category: 'Read', name: 'Pragmatic' },
    { category: 'Language', name: 'Japanese' },
    { category: 'Passion', name: 'Morse Code' },
    { category: 'Health', name: 'Meditate' },
    { category: 'Life', name: 'Work' },
  ];

  activitesChange: Subject<any> = new Subject<any>();
  constructor() {}

  filterActivites = (category: string) => {
    let filteredActivities = this.ACTIVITY_ITEMS.filter((activity) => activity.category === category);
    this.activitesChange.next(filteredActivities);
  };

  resetFilter = () => {
    this.activitesChange.next(this.ACTIVITY_ITEMS);
  };
}
