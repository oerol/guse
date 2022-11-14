import { Component, Input, OnInit } from '@angular/core';
import { ActivityService } from 'src/app/services/activity.service';
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
  _subscription: any;
  constructor(private dayService: DayService, private activityService: ActivityService) {
    dayService.callService();
    this.ACTIVITY_ITEMS = activityService.ACTIVITY_ITEMS;
    this._subscription = activityService.activitesChange.subscribe((value) => {
      this.ACTIVITY_ITEMS = value;
    });
  }

  setMouseIsHeldDown = () => {
    this.mouseIsHeldDown = false;
  };

  ngOnInit(): void {
    document.addEventListener('mouseup', this.setMouseIsHeldDown);
  }

  ngOnDestroy() {
    //prevent memory leak when component destroyed
    this._subscription.unsubscribe();
  }

  getColorForActivity = (categoryName: string) => {
    let category = this.CATEGORY_ITEMS.find((categoryItem) => categoryItem.name === categoryName);

    if (category) {
      return category.color;
    }
    return 'white';
  };
  creatingNewActivityItem = false;

  isVisible = true;

  ACTIVITY_ITEMS: { category: string; name: string }[] = [];

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

  mouseDownInterval: NodeJS.Timeout | undefined;
  mouseIsHeldDown = false;

  handleMouseDown = (e: MouseEvent) => {
    let activityElement = e.target as HTMLElement;

    // Handles child elements
    if (activityElement.id === '') {
      activityElement = activityElement.parentElement as HTMLElement;
    }

    this.mouseIsHeldDown = true;
    this.mouseDownInterval = setTimeout(() => {
      this.activityIndex = parseInt(activityElement.id.split('-')[1]) - 1;
      let activityObject = this.ACTIVITY_ITEMS[this.activityIndex];
      let color = this.getColorForActivity(activityObject.category);

      if (this.mouseIsHeldDown) {
        // user intends to drag the activity
        this.dayService.setGlobalCursor('grabbing');
        let ghostElement = document.getElementById('activity-box-ghost') as HTMLElement;

        ghostElement.innerText = activityObject.name;
        ghostElement.style.display = 'block';
        ghostElement.classList.add(color);

        this.dayService.handleActivityGhostElement(e, ghostElement);

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
      } else {
        // user intends to quickly add the activity to the day
        let boxElement = { height: 1, title: activityObject.name, group: color };
        this.dayService.addToBoxes(boxElement);
        console.log('whopty');
      }
    }, 100); // drag the activity if the mouse is still being pressed down after this interval
  };

  handleMouseMove = (e: MouseEvent) => {
    let ghostElement = document.getElementById('activity-box-ghost') as HTMLElement;

    this.dayService.handleActivityGhostElement(e, ghostElement);
    this.dayService.handleInsertionElement(e, ghostElement);
  };

  handleMouseUp = (e: MouseEvent) => {
    this.dayService.removeGlobalCursor('grabbing');

    let dragBoxElement = document.getElementById('activity-box-ghost') as HTMLElement;
    dragBoxElement.innerText = '';
    dragBoxElement.style.display = 'none';

    let activityObject = this.ACTIVITY_ITEMS[this.activityIndex];
    let color = this.getColorForActivity(activityObject.category);

    dragBoxElement.classList.remove(color);

    let height = 1;

    this.dayService.dragBoxElement = { height: height, title: activityObject.name, group: color };
    this.dayService.applyDrag(e, dragBoxElement);

    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };
}
