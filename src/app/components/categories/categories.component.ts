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

  filteredCategoryIndex = -1;

  handleFilterIndicator = (categoryIndex: number, show: boolean) => {
    let categoryElement = document.getElementsByClassName('category-item-name')[categoryIndex];
    let indicator = '→ ';
    if (show) {
      categoryElement.textContent = indicator + categoryElement.textContent;
    } else {
      categoryElement.textContent = categoryElement.textContent!.replace(indicator, '');
    }
  };

  filterActivities = (e: MouseEvent, categoryItem: { color: string; name: string }) => {
    let categoryIndex = this.CATEGORY_ITEMS.indexOf(categoryItem);

    if (this.filteredCategoryIndex !== categoryIndex) {
      if (this.filteredCategoryIndex !== -1) {
        this.handleFilterIndicator(this.filteredCategoryIndex, false);
      }
      this.activityService.resetFilter();
      this.handleFilterIndicator(categoryIndex, true);
      this.activityService.filterActivites(categoryItem.name);

      this.filteredCategoryIndex = categoryIndex;
    } else {
      this.activityService.resetFilter();
      this.handleFilterIndicator(categoryIndex, false);

      this.filteredCategoryIndex = -1;
    }
  };
}
