import {AfterViewInit, Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef} from '@angular/core';
import {DragDrop, DropListRef, moveItemInArray} from '@angular/cdk/drag-drop';
import {ItemComponent} from './item.component';
import {DragRefInternal as DragRef} from '@angular/cdk/drag-drop/typings/drag-ref';

// Stackoverflow: https://stackoverflow.com/questions/57745880/how-to-create-droplist-items-dynamically-with-angular8
// GitHub Issue: https://github.com/angular/components/issues/16961

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('list', {static: false}) list: HTMLElement;
  @ViewChild('insertPoint', {static: false, read: ViewContainerRef}) insertPoint: ViewContainerRef;

  private dropListRef: DropListRef<ItemComponent>;
  private dragRefs: DragRef[] = new Array<DragRef>();

  constructor(private dragDrop: DragDrop, private resolver: ComponentFactoryResolver, private injector: Injector) {
  }

  ngAfterViewInit(): void {
    this.dropListRef = this.dragDrop
      .createDropList(this.list)
      .withItems(this.dragRefs);

    // suggested workaround
    this.dropListRef.sortingDisabled = true;

    this.dropListRef.lockAxis = 'y';
    this.dropListRef.dropped.subscribe(event => {
      console.log('dropped: ' + event.previousIndex + ' -> ' + event.currentIndex + ', distance: ' + event.distance.y);
      moveItemInArray(this.dragRefs, event.previousIndex, event.currentIndex);
    });
  }

  add() {
    let itemComponentComponentFactory = this.resolver.resolveComponentFactory(ItemComponent);
    let itemComponentComponentRef = itemComponentComponentFactory.create(this.injector);
    itemComponentComponentRef.changeDetectorRef.detectChanges();

    let dragRef = this.dragDrop.createDrag(itemComponentComponentRef.location);

    this.insertPoint.insert(itemComponentComponentRef.hostView);
    this.dragRefs.push(dragRef);
    this.dropListRef.withItems(this.dragRefs);
  }
}
