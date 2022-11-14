import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MouseService {
  mouseIsPressedDown = false;

  indicateMouseUp = () => {
    this.mouseIsPressedDown = false;
  };
  indicateMouseDown = () => {
    this.mouseIsPressedDown = true;
  };

  constructor() {
    document.addEventListener('mouseup', this.indicateMouseUp);
    document.addEventListener('mousedown', this.indicateMouseDown);
    console.log(this.mouseIsPressedDown);
  }

  userIntendsToDrag = () => {
    console.log(this.mouseIsPressedDown);

    return new Promise((resolve, reject) => {
      let intendsToDrag = false;
      setTimeout(() => {
        if (this.mouseIsPressedDown) intendsToDrag = true;
        resolve(intendsToDrag);
      }, 150);
    });
  };
}
