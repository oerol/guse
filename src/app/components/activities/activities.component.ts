import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  @Input() CATEGORY_ITEMS: {
    color: string;
    name: string;
  }[] = [];

  constructor() {}

  ngOnInit(): void {}

  getColorForActivity = (categoryName: string) => {
    let category = this.CATEGORY_ITEMS.find((categoryItem) => categoryItem.name === categoryName);

    if (category) {
      return category.color;
    }
    return 'white';
  };
  creatingNewActivityItem = false;

  isVisible = true;

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

  handleActivitiesVisibility = () => {
    this.isVisible = !this.isVisible;

    let arrowElement = document.getElementById('activities-menu-item-arrow') as HTMLElement;

    let rotation = this.isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
    arrowElement.style.transform = rotation;
  };

  createNewActivityItem = (e: MouseEvent) => {
    this.creatingNewActivityItem = true;
  };

  onKeyDownEvent = (e: Event) => {
    console.log(e);
    let categoryName = (e.target as HTMLInputElement).value;

    let newActivityItem = { category: 'none', name: categoryName };
    this.ACTIVITY_ITEMS.push(newActivityItem);

    this.creatingNewActivityItem = false;
  };
}