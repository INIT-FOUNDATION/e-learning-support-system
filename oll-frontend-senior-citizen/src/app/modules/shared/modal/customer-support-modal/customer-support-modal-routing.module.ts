import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerSupportModalComponent } from './customer-support-modal.component';

const routes: Routes = [{ path: '', component: CustomerSupportModalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerSupportModalRoutingModule {}
