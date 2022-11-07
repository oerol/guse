import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  CATEGORY_ITEMS = [
    { color: 'blue', name: 'Productivity' },
    { color: 'green', name: 'Health' },
    { color: 'crimson', name: 'Language' },
    { color: 'yellow', name: 'Music' },
    { color: 'burlywood', name: 'Life' },
    { color: 'lightblue', name: 'Passion' },
    { color: 'blueviolet', name: 'Read' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
