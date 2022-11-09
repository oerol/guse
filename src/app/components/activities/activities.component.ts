import { Component, Input, OnInit } from '@angular/core';
import { DayService } from 'src/app/services/day.service';

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

  constructor(private dayService: DayService) {
    dayService.callService();
  }

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

  activityIndex = 0;

  handleMouseDown = (e: MouseEvent) => {
    let activityElement = e.target as HTMLElement;

    // Handles child elements
    if (activityElement.id === '') {
      activityElement = activityElement.parentElement as HTMLElement;
    }

    this.activityIndex = parseInt(activityElement.id.split('-')[1]) - 1;
    let activityObject = this.ACTIVITY_ITEMS[this.activityIndex];
    let color = this.getColorForActivity(activityObject.category);

    let dragBoxElement = document.getElementById('activity-box-ghost') as HTMLElement;

    dragBoxElement.innerText = activityObject.name;
    dragBoxElement.style.display = 'block';
    dragBoxElement.classList.add(color);

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseMove = (e: MouseEvent) => {
    let dragBoxElement = document.getElementById('activity-box-ghost') as HTMLElement;
    let height = 25;
    dragBoxElement.style.top = `${e.clientY - height / 2}px`;
    dragBoxElement.style.left = `${e.clientX + 5}px`;

    this.dayService.handleGhostElement(e, dragBoxElement);
    this.dayService.handleInsertionElement(e, dragBoxElement);
  };

  handleMouseUp = (e: MouseEvent) => {
    let dragBoxElement = document.getElementById('activity-box-ghost') as HTMLElement;
    dragBoxElement.innerText = '';
    dragBoxElement.style.display = 'none';

    let activityObject = this.ACTIVITY_ITEMS[this.activityIndex];
    let color = this.getColorForActivity(activityObject.category);

    dragBoxElement.classList.remove(color);

    let height = this.dayService.MIN_BOX_HEIGHT;

    this.dayService.dragBoxElement = { height: height, title: activityObject.name, group: color };
    this.dayService.applyDrag(e, dragBoxElement);

    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };
}
