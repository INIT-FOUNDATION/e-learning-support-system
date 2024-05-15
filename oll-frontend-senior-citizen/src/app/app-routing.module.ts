import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WaitingScreenComponent } from './screens/waiting-screen/waiting-screen.component';
import { NoCustomerSupportAvailableComponent } from './screens/no-customer-support-available/no-customer-support-available.component';
import { NotFoundComponent } from './screens/not-found/not-found.component';
import { UnauthorizedComponent } from './screens/unauthorized/unauthorized.component';
import { ForbiddenComponent } from './screens/forbidden/forbidden.component';
import { TrexWaitingGameComponent } from './screens/trex-waiting-game/trex-waiting-game.component';
import { AuthGuard } from './guards/auth.guard';
import { PreJoinComponent } from './screens/pre-join/pre-join.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    loadChildren: () =>
      import('./screens/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'waiting',
    component: WaitingScreenComponent,
  },
  {
    path: 'no-support',
    component: NoCustomerSupportAvailableComponent,
  },
  {
    path: 'trex-game',
    component: TrexWaitingGameComponent,
  },
  {
    path: 'prejoin',
    component: PreJoinComponent,
  },
  {
    path: 'support',
    loadChildren: () =>
      import('./screens/support-meeting/support-meeting.module').then(
        (m) => m.SupportMeetingModule
      ),
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', redirectTo: 'notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
