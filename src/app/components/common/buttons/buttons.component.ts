import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css'],
})
export class CommonButtonsComponent implements OnInit, AfterViewInit {
  @Input() buttonsList: any;
  @Output() eventTrigger: EventEmitter<any> = new EventEmitter<any>();

  constructor(public router: Router, private renderer: Renderer2) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.buttonsList.forEach((item: any, index: number) => {
      let id = 'custome_' + index;
      var buttonElement = document.getElementById(id);
      if (buttonElement) {
        buttonElement.setAttribute('accesskey', item.accessKey);
        const contentString = buttonElement.textContent;
        if (contentString) {
          const indexToUnderline = item.position;
          const spanElement = this.renderer.createElement('span');
          spanElement.textContent = contentString[indexToUnderline];
          this.renderer.setStyle(spanElement, 'text-decoration', 'underline');
          const updatedContent = contentString.slice(0, indexToUnderline) +
            spanElement.outerHTML +
            contentString.slice(indexToUnderline + 1);
          this.renderer.setProperty(buttonElement, 'innerHTML', updatedContent);
        }

      }
    });
  }

  onBtnClick(type: any) {
    this.eventTrigger.emit(type);
  }
}
