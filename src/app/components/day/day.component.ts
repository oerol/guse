import { Component, OnInit } from '@angular/core';
import { DayService } from 'src/app/services/day.service';
import { Box } from './box';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent implements OnInit {
  mousePosition: string = 'y: ?px';

  boxes: Box[] = [];

  currentBoxIndex = -1; // click on resize-handle
  contextMenuBoxElementIndex = -1; // hover

  MIN_BOX_HEIGHT: number;

  HEIGHT_INCREMENT: number;
  DAY_LENGTH: number;

  TIME_SPENT_AWAKE = 16;

  USER_DAY_START = 7;
  USER_DAY_END = 23;
  USER_DAY_TICKS: number[] = [];

  isResizing = false;

  constructor(private dayService: DayService) {
    let userDayLength = this.USER_DAY_END - this.USER_DAY_START + 1;
    this.USER_DAY_TICKS = Array.from({ length: userDayLength }, (_, i) => i + this.USER_DAY_START);

    dayService.callService();
    this.boxes = dayService.boxes;
    this.HEIGHT_INCREMENT = dayService.HEIGHT_INCREMENT;
    this.DAY_LENGTH = this.TIME_SPENT_AWAKE * 4;
    this.MIN_BOX_HEIGHT = 1 * dayService.HEIGHT_INCREMENT;
  }

  ngOnInit(): void {
    document.onmousemove = this.getMousePosition;
  }

  getBoxClassName = (boxIndex: number) => {
    let className = 'box';

    let boxGroup = this.boxes[boxIndex].group;
    if (boxGroup) {
      className += ' ' + `${boxGroup}`;
    } else {
      className += ' ' + 'black';
    }
    return className;
  };

  getHeightOfOtherBoxes = () => {
    let heights = 0;
    this.boxes.forEach((box, index) => {
      if (index !== this.currentBoxIndex) {
        heights += box.height;
      }
    });

    return heights;
  };

  getMousePosition = (e: MouseEvent) => {
    this.mousePosition = `y: ${e.clientY}px`;
  };

  onMouseMove = (e: MouseEvent) => {
    let currentBox = document.getElementsByClassName('box')[this.currentBoxIndex];
    let boxSize = currentBox.getBoundingClientRect();

    let intendedBoxHeight = e.clientY - boxSize.top;
    let incrementedBoxHeight = Math.floor(intendedBoxHeight / this.HEIGHT_INCREMENT);

    let heightsOfOtherBoxes = this.getHeightOfOtherBoxes();

    let newBoxHeight;
    if (incrementedBoxHeight < 1) {
      newBoxHeight = 1;
    } else if (incrementedBoxHeight + heightsOfOtherBoxes > this.DAY_LENGTH) {
      newBoxHeight = this.DAY_LENGTH - heightsOfOtherBoxes;
    } else {
      newBoxHeight = incrementedBoxHeight;
    }
    console.log(newBoxHeight);
    this.boxes[this.currentBoxIndex].height = newBoxHeight;
  };

  onMouseUp = (e: MouseEvent) => {
    this.isResizing = false;
    this.dayService.removeGlobalCursor('ns-resize');

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  setCurrentBoxIndex = (dragHandleElement: HTMLElement) => {
    let boxElement = dragHandleElement.parentElement as HTMLDivElement;
    let boxElementID = boxElement.id.split('-')[1];
    this.currentBoxIndex = parseInt(boxElementID) - 1;
  };

  //* Gets executed on drag-handle mousedown */
  startBoxResize = (e: MouseEvent) => {
    e.preventDefault();
    this.setCurrentBoxIndex(e.target as HTMLDivElement);

    this.isResizing = true;

    this.dayService.setGlobalCursor('ns-resize');

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  boxesToString() {
    return JSON.stringify(this.boxes);
  }

  createNewBox() {
    let newBox = { title: 'new box', height: this.MIN_BOX_HEIGHT };
    this.boxes.push(newBox);
  }

  getBoxDuration(boxHeight: number) {
    return this.dayService.convertBoxHeightToHours(boxHeight);
  }

  showContextMenu(targetElement: HTMLElement) {
    let contextMenuElement = document.getElementById('box-context-menu') as HTMLDivElement;
    let boxElementSize = targetElement.getBoundingClientRect();

    contextMenuElement.style.display = 'flex';
    contextMenuElement.style.left = `${boxElementSize.right + 10}px`;
    contextMenuElement.style.top = `${boxElementSize.top + 2}px`; // 2: box border
  }

  setContextMenuBoxElementIndex = (hoverElement: HTMLElement) => {
    let isBoxElement = hoverElement.classList.contains('box');

    let boxElement: HTMLElement;
    if (isBoxElement) {
      boxElement = hoverElement;
    } else {
      boxElement = hoverElement.parentElement!;
    }

    let boxElementID = boxElement.id.split('-')[1];
    this.contextMenuBoxElementIndex = parseInt(boxElementID) - 1;
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.isResizing) {
      let hoverElement = e.target as HTMLDivElement;
      this.setContextMenuBoxElementIndex(hoverElement);
      let boxElement = document.getElementsByClassName('box')[this.contextMenuBoxElementIndex] as HTMLElement;

      this.showContextMenu(boxElement);
    }
  };

  changeCategory = (color: string) => {
    this.boxes[this.contextMenuBoxElementIndex].group = color;
  };

  createGhostElement = (originalElement: HTMLElement) => {
    let ghostBoxElement = originalElement.cloneNode(true) as HTMLElement;
    ghostBoxElement.id = 'box-ghost';
    ghostBoxElement.style.position = 'absolute';
    ghostBoxElement.style.padding = '5px';
    document.body.append(ghostBoxElement);
  };

  handleGhostElement = (e: MouseEvent) => {
    let ghostBoxElement = document.getElementById('box-ghost') as HTMLElement;
    let boxWidth = 200; // Todo

    ghostBoxElement.style.top = `${e.clientY - this.MIN_BOX_HEIGHT / 2}px`;
    ghostBoxElement.style.left = `${e.clientX - boxWidth / 2}px`;
    ghostBoxElement.style.height = `${this.MIN_BOX_HEIGHT}px`;
  };

  fadeOutBox = (boxElement: HTMLElement, boxElementIndex: number) => {
    boxElement.style.height = '0px';
    boxElement.style.padding = '0px';
    setTimeout(() => {
      boxElement.style.border = 'none';
      this.dayService.dragBoxElement = this.boxes.splice(boxElementIndex, 1)[0];
    }, 200 - 50); // 0.2s: transition
  };

  dragBox = (e: MouseEvent) => {
    let boxElement = e.target as HTMLElement;

    if (boxElement.id.includes('box')) {
      let index = boxElement.id.split('-')[1];
      this.dayService.dragBoxElementIndex = parseInt(index) - 1;

      this.dayService.setGlobalCursor('grabbing');

      this.fadeOutBox(boxElement, this.dayService.dragBoxElementIndex);

      // Visual feedback
      this.createGhostElement(boxElement);
      this.handleGhostElement(e);

      document.addEventListener('mousemove', this.ghostDragBox);
      document.addEventListener('mouseup', this.endDragBox);
    }
  };

  insertable = false;

  handleInsertionElement = (e: MouseEvent) => {
    let clientY = e.clientY;
    let boxElements = Array.from(document.getElementsByClassName('box'));
    boxElements = boxElements.filter((boxElement) => boxElement.id !== 'box-ghost');

    let ghostElement = document.getElementById('box-ghost') as HTMLElement;

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
    ghostElement.style.boxShadow = `none`;
    ghostElement.style.opacity = '0.5';

    this.insertable = false;
  };

  ghostDragBox = (e: MouseEvent) => {
    let ghostElement = document.getElementById('box-ghost') as HTMLElement;

    this.dayService.handleGhostElement(e, ghostElement);
    this.dayService.handleInsertionElement(e, ghostElement);
    /*     this.handleGhostElement(e);
    this.handleInsertionElement(e); */
  };

  endDragBox = (e: MouseEvent) => {
    this.dayService.removeGlobalCursor('grabbing');
    let ghostElement = document.getElementById('box-ghost') as HTMLElement;

    this.dayService.applyDrag(e, ghostElement);

    document.removeEventListener('mousemove', this.ghostDragBox);
    document.removeEventListener('mouseup', this.endDragBox);
  };

  removeBox = () => {
    let boxElement = document.getElementsByClassName('box')[this.contextMenuBoxElementIndex] as HTMLElement;
    this.fadeOutBox(boxElement, this.contextMenuBoxElementIndex);
  };
}
