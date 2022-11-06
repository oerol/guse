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

  CATEGORY_ITEMS = [
    { color: 'red', name: 'Hobbies' },
    { color: 'green', name: 'Health' },
    { color: 'blue', name: 'Work' },
  ];

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
