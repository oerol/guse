import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  ACTIVITY_ITEMS = [
    { category: 'Skills', name: '3D Modelling' },
    { category: 'Passion', name: 'Chess' },
    { category: 'Health', name: 'Run' },
    { category: 'Books', name: 'Educated' },
    { category: 'Skills', name: 'Photoshop' },
    { category: 'Music', name: 'Piano' },
    { category: 'Books', name: 'Notes' },
    { category: 'Skills', name: 'Code' },
    { category: 'Language', name: 'English' },
    { category: 'Health', name: 'Gym' },
    { category: 'Self-Development', name: 'Journal' },
    { category: 'Books', name: 'Pragmatic' },
    { category: 'Language', name: 'Japanese' },
    { category: 'Passion', name: 'Morse Code' },
    { category: 'Health', name: 'Meditate' },
    { category: 'Skills', name: 'Video Editing' },
    { category: 'Books', name: 'C&P' },
    { category: 'Learning', name: 'Linux' },
  ];

  activitesChange: Subject<any> = new Subject<any>();
  constructor() {
    this.ACTIVITY_ITEMS.sort((a, b) => a.name.localeCompare(b.name));
  }

  currentFilteredCategory = '';

  filterActivites = (category: string) => {
    this.currentFilteredCategory = category;

    let filteredActivities = this.ACTIVITY_ITEMS.filter((activity) => activity.category === category);
    this.activitesChange.next(filteredActivities);
  };

  resetFilter = () => {
    this.activitesChange.next(this.ACTIVITY_ITEMS);
  };
}
