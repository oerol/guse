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
  currentBoxIndex = -1;

  MIN_BOX_HEIGHT = 25;
  HEIGHT_INCREMENT = 25;

  DAY_LENGTH = 16 * 2 * this.HEIGHT_INCREMENT;

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

  showContextMenu(targetElement: HTMLDivElement) {
    let boxElementSize = targetElement.getBoundingClientRect();

    let contextMenuElement = document.getElementById(
      'box-context-menu'
    ) as HTMLDivElement;

    contextMenuElement.style.display = 'block';
    contextMenuElement.style.left = `${boxElementSize.right + 10}px`;
    contextMenuElement.style.top = `${boxElementSize.top}px`;
  }

  hideContextMenu() {
    let contextMenuElement = document.getElementById(
      'box-context-menu'
    ) as HTMLDivElement;

    contextMenuElement.style.display = 'none';
  }

  contextMenuBoxElementIndex = -1;

  handleMouseMove = (e: MouseEvent) => {
    let boxElement = e.target as HTMLDivElement;

    // Use the main box element to place the context menu
    if (boxElement.classList.contains('box')) {
      this.showContextMenu(boxElement);

      let boxElementID = boxElement.id.split('-')[1];
      this.contextMenuBoxElementIndex = parseInt(boxElementID);
    }
  };

  handleMouseLeave = (e: MouseEvent) => {
    // this.hideContextMenu();
  };

  changeCategory = (color: string) => {
    this.boxes[this.contextMenuBoxElementIndex - 1].group = color;
  };

  dragBoxElementIndex = -1;

  dragBox = (e: MouseEvent) => {
    let boxElement = e.target as HTMLElement;

    if (boxElement.id.includes('box')) {
      boxElement.classList.add('box-drag');

      let index = boxElement.id.split('-')[1];
      this.dragBoxElementIndex = parseInt(index) - 1;

      // https://stackoverflow.com/questions/10750582/global-override-of-mouse-cursor-with-javascript
      const cursorStyle = document.createElement('style');
      cursorStyle.innerHTML = '*{cursor: grabbing!important;}';
      cursorStyle.id = 'cursor-style';
      document.head.appendChild(cursorStyle);

      // Visual feedback

      let ghostBoxElement = boxElement.cloneNode(true) as HTMLElement;
      ghostBoxElement.id = 'box-ghost';
      ghostBoxElement.classList.remove('box-drag');
      ghostBoxElement.style.position = 'absolute';
      document.body.append(ghostBoxElement);

      ghostBoxElement.style.top = `${e.clientY}px`;
      ghostBoxElement.style.left = `${e.clientX}px`;

      document.addEventListener('mousemove', this.ghostDragBox);
      document.addEventListener('mouseup', this.endDragBox);
    }
  };

  ghostDragBox = (e: MouseEvent) => {
    let boxElement =
      document.getElementsByClassName('box')[this.dragBoxElementIndex];

    let ghostBoxElement = document.getElementById('box-ghost') as HTMLElement;
    ghostBoxElement.style.top = `${e.clientY}px`;
    ghostBoxElement.style.left = `${e.clientX}px`;
  };

  endDragBox = (e: MouseEvent) => {
    let currentBox =
      document.getElementsByClassName('box')[this.dragBoxElementIndex];
    currentBox.classList.remove('box-drag');

    document.getElementById('cursor-style')!.remove();

    let newBoxPosition = e.clientY;

    let boxElements = Array.from(document.getElementsByClassName('box'));
    let firstBoxElementPosition = boxElements[0].getBoundingClientRect();

    if (newBoxPosition < firstBoxElementPosition.top) {
      let currentBoxArrayElement = this.boxes.splice(
        this.dragBoxElementIndex,
        1
      )[0];
      let boxElementIndex = parseInt(boxElements[0].id.split('-')[1]) - 1;

      this.boxes.splice(boxElementIndex, 0, currentBoxArrayElement);
    } else {
      boxElements.reverse();

      for (let boxElement of boxElements) {
        let boxElementPosition = boxElement.getBoundingClientRect();

        if (newBoxPosition > boxElementPosition.top) {
          console.log(boxElement);
          let boxElementIndex = parseInt(boxElement.id.split('-')[1]) - 1;

          let currentBoxArrayElement = this.boxes.splice(
            this.dragBoxElementIndex,
            1
          )[0];
          console.log(currentBoxArrayElement);
          this.boxes.splice(boxElementIndex, 0, currentBoxArrayElement);
          break;
        }
      }
    }

    let ghostBoxElement = document.getElementById('box-ghost') as HTMLElement;
    ghostBoxElement.remove();

    document.removeEventListener('mousemove', this.ghostDragBox);
    document.removeEventListener('mouseup', this.endDragBox);
  };
}
