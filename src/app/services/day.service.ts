import { Injectable } from '@angular/core';
import { Box } from '../components/day/box';

@Injectable({
  providedIn: 'root',
})
export class DayService {
  count = 0;
  MIN_BOX_HEIGHT = 25;
  HEIGHT_INCREMENT = 25;

  constructor() {}

  callService() {
    this.count++;
    console.log(this.count);
  }

  convertBoxHeightToHours = (boxHeight: number) => {
    let duration = boxHeight / 2;
    let durationInHours = Math.floor(duration);

    if (duration % 1 === 0) {
      return `${durationInHours}:00`;
    } else {
      return `${durationInHours}:30`;
    }
  };

  handleActivityGhostElement = (e: MouseEvent, ghostElement: HTMLElement) => {
    ghostElement.style.top = `${e.clientY - this.MIN_BOX_HEIGHT / 2}px`;
    ghostElement.style.left = `${e.clientX + 5}px`;
  };

  handleGhostElement = (e: MouseEvent, ghostElement: HTMLElement) => {
    let boxWidth = 200; // Todo

    ghostElement.style.top = `${e.clientY - this.MIN_BOX_HEIGHT / 2}px`;
    ghostElement.style.left = `${e.clientX - boxWidth / 2}px`;
    ghostElement.style.height = `${this.MIN_BOX_HEIGHT}px`;
  };

  insertable = false;

  handleInsertionElement = (e: MouseEvent, ghostElement: HTMLElement) => {
    let clientY = e.clientY;
    let clientX = e.clientX;

    let dayElement = document.getElementsByClassName('day')[0];
    let dayElementPosition = dayElement.getBoundingClientRect();

    let insertableLeft = clientX > dayElementPosition.left - 10;
    let insertableRight = clientX < dayElementPosition.right + 10;

    if (insertableLeft && insertableRight) {
      let boxElements = Array.from(document.getElementsByClassName('box'));
      boxElements = boxElements.filter((boxElement) => boxElement.id !== 'box-ghost');

      for (let boxElement of boxElements) {
        let boxElementBoundingBox = boxElement.getBoundingClientRect();
        let insertableAbove = clientY >= boxElementBoundingBox.top && clientY <= boxElementBoundingBox.top + 10;
        let insertableBelow = clientY >= boxElementBoundingBox.bottom - 10 && clientY <= boxElementBoundingBox.bottom;

        if (insertableAbove || insertableBelow) {
          ghostElement.style.opacity = '0.95';
          ghostElement.style.boxShadow = `0px 0px 10px 5px rgba(0,0,0,0.4)`;

          this.insertable = true;
          return;
        }
      }
    }

    ghostElement.style.boxShadow = `none`;
    ghostElement.style.opacity = '0.5';

    this.insertable = false;
  };

  boxes: Box[] = [
    { title: 'meditate', height: 1, group: 'green' },
    { title: 'read', height: 2, group: 'blue' },
    { title: 'breakfast', height: 1 },
    { title: 'work', height: 4, group: 'gray' },
    { title: 'rest', height: 1 },
    { title: 'workout', height: 2, group: 'green' },
    { title: 'rest', height: 2 },
    { title: 'game', height: 3, group: 'blueviolet' },
    { title: 'piano', height: 2, group: 'yellow' },
    { title: 'study', height: 5, group: 'blue' },
    { title: 'rest', height: 1 },
  ];

  dragBoxElement: Box | undefined;
  dragBoxElementIndex = -1; // click on box

  getHeightOfAllBoxes = () => {
    let totalHeight = 0;

    this.boxes.forEach((box) => {
      totalHeight += box.height;
    });

    return totalHeight;
  };

  applyDrag = (e: MouseEvent, dragBoxElement: HTMLElement) => {
    let newBoxPosition = e.clientY;

    let boxElements = Array.from(document.getElementsByClassName('box'));
    boxElements = boxElements.filter((boxElement) => boxElement.id !== 'box-ghost');

    let currentBoxArrayElementHeight = this.dragBoxElement!.height;
    this.dragBoxElement!.height = 0;

    let newBoxElementIndex: number = 0;
    if (this.insertable) {
      if (this.getHeightOfAllBoxes() < 16 * 2) {
        let lastBoxElement = boxElements[boxElements.length - 1];
        let lastBoxElementBoundingBox = lastBoxElement.getBoundingClientRect();

        if (newBoxPosition >= lastBoxElementBoundingBox.top) {
          newBoxElementIndex = boxElements.length;
        }
        for (let boxElement of boxElements) {
          let boxElementBoundingBox = boxElement.getBoundingClientRect();

          if (newBoxPosition <= boxElementBoundingBox.bottom - 10) {
            newBoxElementIndex = parseInt(boxElement.id.split('-')[1]) - 1; // new position
            break;
          }
        }
      } else {
        return;
      }
    } else {
      if (dragBoxElement.id == 'box-ghost') {
        newBoxElementIndex = this.dragBoxElementIndex;
      } else if (dragBoxElement.id == 'activity-box-ghost') {
        return;
      }
    }

    this.boxes.splice(newBoxElementIndex, 0, this.dragBoxElement!);

    setTimeout(() => {
      this.boxes[newBoxElementIndex].height = currentBoxArrayElementHeight;
    }, 1);

    if (dragBoxElement.id === 'box-ghost') dragBoxElement.remove();

    if (dragBoxElement.id === 'activity-box-ghost') {
      dragBoxElement.style.boxShadow = `none`;
      dragBoxElement.style.opacity = '0.5';
    }
  };
}
