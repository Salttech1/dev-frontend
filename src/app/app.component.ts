import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'erp';

  constructor(private renderer: Renderer2, private toastr: ToastrService) {}

  ngOnInit(): void {
    const body = document.getElementsByTagName('body');
    this.renderer.addClass(body[0], environment.theme);
  }
  //event listen for
  @HostListener('click', ['$event']) onClick(event: MouseEvent): void {
    // Perform actions when an element with the class is clicked
    const clickedElement: any = event.target as HTMLElement;
    // Check if the clicked element has the desired class
    if (clickedElement.classList.contains('custom-img-class')) {
      const parentElement: HTMLElement =
        clickedElement.parentElement.parentElement;
      // Find the input element within parentElement
      const inputElement: HTMLInputElement | null =
        parentElement.querySelector('input[type="text"]');
      if (inputElement) {
        inputElement.focus();
        const isDisabled = inputElement.hasAttribute('disabled');
        if (!isDisabled) {
          // Create a new KeyboardEvent for the 'keydown' event with the F1 key
          const keydownEvent = new KeyboardEvent('keydown', {
            key: 'F1',
            code: 'F1',
            keyCode: 112, // Key code for F1
            which: 112, // Key code for F1
            shiftKey: false, // Whether shift key is pressed
            altKey: false, // Whether alt key is pressed
            ctrlKey: false, // Whether control key is pressed
            metaKey: false, // Whether meta key (Command key on macOS) is pressed
          });

          // Dispatch the 'keydown' event on the input element
          inputElement.dispatchEvent(keydownEvent);

          // Create a new KeyboardEvent for the 'keyup' event with the F1 key
          const keyupEvent = new KeyboardEvent('keyup', {
            key: 'F1',
            code: 'F1',
            keyCode: 112, // Key code for F1
            which: 112, // Key code for F1
            shiftKey: false,
            altKey: false,
            ctrlKey: false,
            metaKey: false,
          });

          // Dispatch the 'keyup' event on the input element
          inputElement.dispatchEvent(keyupEvent);
        }
      }
    }
  }

  @HostListener('keydown.F1', ['$event'])
  eventPress(e: any) {
    e?.preventDefault();
    const targetElement = e.target as HTMLElement;
    targetElement.hasAttribute('ng-reflect-f1')
      ? ''
      : targetElement.hasAttribute('ng-reflect-form')
      ? ''
      : this.toastr.error('Help not available here');
  }
}
