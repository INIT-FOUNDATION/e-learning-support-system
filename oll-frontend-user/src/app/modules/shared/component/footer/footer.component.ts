import { Component } from '@angular/core';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(public utilityService: UtilityService) {}
}
