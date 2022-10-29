import { Component, OnInit } from '@angular/core';
import { Box } from './box';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent implements OnInit {
  mousePosition: string = 'y: ?px';
  boxes: Box[] = [
    { title: 'first box', height: 50 },
    { title: 'first box', height: 100 },
  ];
  currentBoxIndex = 0;

  MIN_BOX_HEIGHT = 50;

  constructor() {}

  getMousePostion = (e: MouseEvent) => {
    this.mousePosition = `y: ${e.clientY}px`;
  };

  onMouseMove = (e: MouseEvent) => {
    let currentBox =
      document.getElementsByClassName('box')[this.currentBoxIndex];
    let boxSize = currentBox.getBoundingClientRect();
    console.log(boxSize.top);

    let newBoxHeight = e.clientY - boxSize.top;

    if (newBoxHeight < this.MIN_BOX_HEIGHT) {
      this.boxes[this.currentBoxIndex].height = this.MIN_BOX_HEIGHT;
    } else {
      this.boxes[this.currentBoxIndex].height = newBoxHeight;
    }
  };
  onMouseUp = (e: MouseEvent) => {
    console.log('up');

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    console.log('down');

    let dragHandle = e.target as HTMLDivElement;

    let boxElement = dragHandle.parentElement as HTMLDivElement;
    let boxElementID = boxElement.id.split('-')[1];
    this.currentBoxIndex = parseInt(boxElementID) - 1;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  ngOnInit(): void {
    document.onmousemove = this.getMousePostion;
  }

  boxesToString() {
    return JSON.stringify(this.boxes);
  }

  createNewBox() {
    let newBox = { title: 'new box', height: this.MIN_BOX_HEIGHT };
    this.boxes.push(newBox);
  }
}
