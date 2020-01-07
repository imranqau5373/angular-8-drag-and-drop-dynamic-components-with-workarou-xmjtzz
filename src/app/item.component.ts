import {Component, ViewChild, ViewRef} from '@angular/core';

@Component({
  selector: 'item',
  template: `
      <div>
          {{title}}
      </div>
  `
})
export class ItemComponent {

  private static COUNTER: number = 0;
  
  title: string = 'Item ' + ItemComponent.COUNTER++;
}
