import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  creatingNewCategoryItem = false;

  isVisible = true;

  CATEGORY_ITEMS = [
    { color: 'blue', name: 'Productivity' },
    { color: 'green', name: 'Health' },
    { color: 'violet', name: 'Language' },
    { color: 'yellow', name: 'Music' },
    { color: 'gray', name: 'Work' },
    { color: 'lightblue', name: 'Passion' },
  ];

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
}
