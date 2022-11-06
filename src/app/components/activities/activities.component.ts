import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  creatingNewActivityItem = false;

  isVisible = true;

  ACTIVITY_ITEMS = [
    { color: 'red', name: 'Run' },
    { color: 'red', name: 'Meditate' },
    { color: 'green', name: 'Think' },
  ];

  handleActivitiesVisibility = () => {
    this.isVisible = !this.isVisible;

    let arrowElement = document.getElementById('menu-item-arrow') as HTMLElement;

    let rotation = this.isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
    arrowElement.style.transform = rotation;
  };

  createNewActivityItem = (e: MouseEvent) => {
    this.creatingNewActivityItem = true;
  };

  onKeyDownEvent = (e: Event) => {
    console.log(e);
    let categoryName = (e.target as HTMLInputElement).value;

    let newActivityItem = { color: 'white', name: categoryName };
    this.ACTIVITY_ITEMS.push(newActivityItem);

    this.creatingNewActivityItem = false;
  };
}
