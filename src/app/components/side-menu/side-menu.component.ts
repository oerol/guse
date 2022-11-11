import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  CATEGORY_ITEMS = [
    { color: 'blue', name: 'Learning' },
    { color: 'plum', name: 'Skills' },
    { color: 'green', name: 'Health' },
    { color: 'crimson', name: 'Language' },
    { color: 'yellow', name: 'Music' },
    { color: 'burlywood', name: 'Life' },
    { color: 'lightblue', name: 'Passion' },
    { color: 'blueviolet', name: 'Books' },
    { color: 'brown', name: 'Entertainment' },
    { color: 'darkseagreen', name: 'Self-Development' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
