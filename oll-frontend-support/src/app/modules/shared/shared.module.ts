import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { FaceAuthenticationModalComponent } from './modal/face-authentication-modal/face-authentication-modal/face-authentication-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from './component/loader/loader.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RecordingModalComponent } from './modal/recording-modal/recording-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { ProfileComponent } from './component/profile/profile.component';
import { DndDirective } from './directives/dnd.directive';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatTabsModule } from '@angular/material/tabs';
import { CalendarModalComponent } from './modal/calendar-modal/calendar-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';

const export_material_modules = [
  MatInputModule,
  MatFormFieldModule,
  FormsModule,
  ReactiveFormsModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  RouterModule,
  MatDialogModule,
  MatButtonModule,
  MatTooltipModule,
  NgxSpinnerModule,
  MatIconModule,
  ImageCropperModule,
  MatTabsModule,
  MatDatepickerModule,
  MatCardModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatRadioModule,
];

const export_directives = [DndDirective];

const export_components = [
  HeaderComponent,
  FooterComponent,
  LoaderComponent,
  FaceAuthenticationModalComponent,
  ProfileComponent,
  CalendarModalComponent,
];

@NgModule({
  declarations: [
    ...export_components,
    RecordingModalComponent,
    ...export_directives,
  ],
  imports: [CommonModule, ...export_material_modules, ToastrModule.forRoot()],
  exports: [
    ...export_material_modules,
    ...export_components,
    ToastrModule,
    ...export_directives,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
