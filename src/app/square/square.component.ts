import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-square',
  template: `
    <button *ngIf="!value" mat-raised-button style="width: 100%; height: 100%"></button>
    <button
      *ngIf="value == 'X'"
      color="primary"
      mat-raised-button
      style="width: 100%; height: 100%"
    >
      {{ value }}
    </button>
    <button
      *ngIf="value == 'O'"
      color="accent"
      mat-raised-button
      style="width: 100%; height: 100%"
    >
      {{ value }}
    </button>
  `,
  styles: [
    `
      button {
        font-size: 5em;
      }
    `,
  ],
})
export class SquareComponent {
  @Input() value: 'X' | 'O' | null = null;
}
