import { Component, Input, OnInit } from '@angular/core';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @Input() CATEGORY_ITEMS: {
    color: string;
    name: string;
  }[] = [];
  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {}

  creatingNewCategoryItem = false;

  isVisible = true;

  handleCategoriesVisibility = () => {
    this.isVisible = !this.isVisible;

    let arrowElement = document.getElementById('categories-menu-item-arrow') as HTMLElement;

    let rotation = this.isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
    arrowElement.style.transform = rotation;
  };

  createNewCategoryItem = (e: MouseEvent) => {
    this.creatingNewCategoryItem = true;
  };

  onKeyDownEvent = (e: Event) => {
    console.log(e);
    let categoryName = (e.target as HTMLInputElement).value;

    let newCategoryItem = { color: 'white', name: categoryName };
    this.CATEGORY_ITEMS.push(newCategoryItem);

    this.creatingNewCategoryItem = false;
  };

  filterIsActive = false;

  filterActivities = (e: MouseEvent, categoryItem: { color: string; name: string }) => {
    this.filterIsActive = !this.filterIsActive;

    if (this.filterIsActive) {
      this.activityService.filterActivites(categoryItem.name);
    } else {
      this.activityService.resetFilter();
    }
  };
}
