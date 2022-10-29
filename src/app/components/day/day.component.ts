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
    { title: 'first box', height: 30 },
    { title: 'second box', height: 120 },
  ];
  currentBoxIndex = -1;

  MIN_BOX_HEIGHT = 30;
  HEIGHT_INCREMENT = 30;

  DAY_LENGTH = 24 * this.HEIGHT_INCREMENT;

  constructor() {}

  getOtherBoxesHeights = () => {
    let heights = 0;
    this.boxes.forEach((box, index) => {
      if (index !== this.currentBoxIndex) {
        heights += box.height;
      }
    });

    return heights;
  };

  getMousePostion = (e: MouseEvent) => {
    this.mousePosition = `y: ${e.clientY}px`;
  };

  onMouseMove = (e: MouseEvent) => {
    let currentBox =
      document.getElementsByClassName('box')[this.currentBoxIndex];
    let boxSize = currentBox.getBoundingClientRect();

    let newBoxHeight = e.clientY - boxSize.top;
    let incrementedBoxHeight =
      Math.floor(newBoxHeight / this.HEIGHT_INCREMENT) * this.HEIGHT_INCREMENT;

    let otherBoxesHeights = this.getOtherBoxesHeights();

    if (incrementedBoxHeight < this.MIN_BOX_HEIGHT) {
      this.boxes[this.currentBoxIndex].height = this.MIN_BOX_HEIGHT;
    } else if (incrementedBoxHeight + otherBoxesHeights > this.DAY_LENGTH) {
      this.boxes[this.currentBoxIndex].height =
        this.DAY_LENGTH - otherBoxesHeights;
    } else {
      this.boxes[this.currentBoxIndex].height = incrementedBoxHeight;
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

  getBoxDuration(boxHeight: number) {
    let duration = boxHeight / this.HEIGHT_INCREMENT / 2;
    let durationInHours = Math.floor(duration);

    if (duration % 1 === 0) {
      return `${durationInHours}:00`;
    } else {
      return `${durationInHours}:30`;
    }
  }
}