import { Component, Input } from '@angular/core';

@Component({
 selector: 'progress-bar',
 templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

 @Input('progress') progress:any;
 @Input('duration') duration:any;

 constructor() {
 }

}