import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirection-modal',
  templateUrl: './redirection-modal.component.html',
  styleUrls: ['./redirection-modal.component.scss'],
})
export class RedirectionModalComponent {
  constructor(private router: Router) {}
  @Output() openModal: EventEmitter<void> = new EventEmitter<void>();
}
