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
    { title: 'meditate', height: 25, group: 'green' },
    { title: 'read', height: 50, group: 'blue' },
    { title: 'breakfast', height: 25 },
    { title: 'work', height: 200, group: 'gray' },
    { title: 'rest', height: 25 },
    { title: 'workout', height: 100, group: 'green' },
    { title: 'rest', height: 50 },
    { title: 'game', height: 75, group: 'purple' },
    { title: 'piano', height: 50, group: 'yellow' },
    { title: 'study', height: 125, group: 'blue' },
    { title: 'rest', height: 25 },
    { title: 'read', height: 50, group: 'blue' },
  ];

  currentBoxIndex = -1; // click on resize-handle
  contextMenuBoxElementIndex = -1; // hover
  dragBoxElementIndex = -1; // click on box

  MIN_BOX_HEIGHT = 25;

  HEIGHT_INCREMENT = 25;
  HEIGHT_IN_HOURS = 0.5;

  TIME_SPENT_AWAKE = 16;

  DAY_LENGTH = this.TIME_SPENT_AWAKE * 2 * this.HEIGHT_INCREMENT;

  USER_DAY_START = 7;
  USER_DAY_END = 23;
  USER_DAY_TICKS: number[] = [];

  isResizing = false;

  constructor() {
    let userDayLength = this.USER_DAY_END - this.USER_DAY_START + 1;
    this.USER_DAY_TICKS = Array.from({ length: userDayLength }, (_, i) => i + this.USER_DAY_START);
  }

  ngOnInit(): void {
    document.onmousemove = this.getMousePosition;
  }

  getBoxClassName = (boxIndex: number) => {
    let className = 'box';

    let boxGroup = this.boxes[boxIndex].group;
    if (boxGroup) {
      className += ' ' + `group-${boxGroup}`;
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
    let incrementedBoxHeight = Math.floor(intendedBoxHeight / this.HEIGHT_INCREMENT) * this.HEIGHT_INCREMENT;

    let heightsOfOtherBoxes = this.getHeightOfOtherBoxes();

    let newBoxHeight;
    if (incrementedBoxHeight < this.MIN_BOX_HEIGHT) {
      newBoxHeight = this.MIN_BOX_HEIGHT;
    } else if (incrementedBoxHeight + heightsOfOtherBoxes > this.DAY_LENGTH) {
      newBoxHeight = this.DAY_LENGTH - heightsOfOtherBoxes;
    } else {
      newBoxHeight = incrementedBoxHeight;
    }
    this.boxes[this.currentBoxIndex].height = newBoxHeight;
  };

  onMouseUp = (e: MouseEvent) => {
    this.isResizing = false;
    this.removeGlobalCursor('ns-resize');

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

    this.setGlobalCursor('ns-resize');

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
    let duration = boxHeight / this.HEIGHT_INCREMENT / 2;
    let durationInHours = Math.floor(duration);

    if (duration % 1 === 0) {
      return `${durationInHours}:00`;
    } else {
      return `${durationInHours}:30`;
    }
  }

  showContextMenu(targetElement: HTMLElement) {
    let contextMenuElement = document.getElementById('box-context-menu') as HTMLDivElement;
    let boxElementSize = targetElement.getBoundingClientRect();

    contextMenuElement.style.display = 'block';
    contextMenuElement.style.left = `${boxElementSize.right + 10}px`;
    contextMenuElement.style.top = `${boxElementSize.top}px`;
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

  // https://stackoverflow.com/questions/10750582/global-override-of-mouse-cursor-with-javascript
  setGlobalCursor = (cursor: string) => {
    const cursorStyle = document.createElement('style');
    cursorStyle.innerHTML = `*{cursor: ${cursor}!important;}`;
    cursorStyle.id = `global-cursor-style-${cursor}`;
    document.head.appendChild(cursorStyle);
  };

  removeGlobalCursor = (cursor: string) => {
    document.getElementById(`global-cursor-style-${cursor}`)!.remove();
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

  dragBoxElement: Box | undefined;

  fadeOutBox = (boxElement: HTMLElement, boxElementIndex: number) => {
    boxElement.style.height = '0px';
    boxElement.style.padding = '0px';
    setTimeout(() => {
      boxElement.style.border = 'none';
      this.dragBoxElement = this.boxes.splice(boxElementIndex, 1)[0];
    }, 200 - 50); // 0.2s: transition
  };

  dragBox = (e: MouseEvent) => {
    let boxElement = e.target as HTMLElement;

    if (boxElement.id.includes('box')) {
      let index = boxElement.id.split('-')[1];
      this.dragBoxElementIndex = parseInt(index) - 1;

      this.setGlobalCursor('grabbing');

      this.fadeOutBox(boxElement, this.dragBoxElementIndex);

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
    this.handleGhostElement(e);
    this.handleInsertionElement(e);
  };

  endDragBox = (e: MouseEvent) => {
    this.removeGlobalCursor('grabbing');

    let newBoxPosition = e.clientY;

    let boxElements = Array.from(document.getElementsByClassName('box'));
    boxElements = boxElements.filter((boxElement) => boxElement.id !== 'box-ghost');

    let currentBoxArrayElementHeight = this.dragBoxElement!.height;
    this.dragBoxElement!.height = 0;

    let newBoxElementIndex: number = 0;
    if (this.insertable) {
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
      newBoxElementIndex = this.dragBoxElementIndex;
    }

    this.boxes.splice(newBoxElementIndex, 0, this.dragBoxElement!);

    setTimeout(() => {
      this.boxes[newBoxElementIndex].height = currentBoxArrayElementHeight;
    }, 1);

    let ghostBoxElement = document.getElementById('box-ghost') as HTMLElement;
    ghostBoxElement.remove();

    document.removeEventListener('mousemove', this.ghostDragBox);
    document.removeEventListener('mouseup', this.endDragBox);
  };

  removeBox = () => {
    let boxElement = document.getElementsByClassName('box')[this.contextMenuBoxElementIndex] as HTMLElement;
    this.fadeOutBox(boxElement, this.contextMenuBoxElementIndex);
  };
}
