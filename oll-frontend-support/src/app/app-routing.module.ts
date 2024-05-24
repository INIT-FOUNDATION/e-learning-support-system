import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './screens/not-found/not-found.component';
import { UnauthorizedComponent } from './screens/unauthorized/unauthorized.component';
import { ForbiddenComponent } from './screens/forbidden/forbidden.component';
import { AuthGuard } from './guards/auth.guard';
import { PreJoinComponent } from './screens/pre-join/pre-join.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./screens/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./screens/registration/registration.module').then(
        (m) => m.RegistrationModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'prejoin',
    component: PreJoinComponent,
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./screens/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'support',
    loadChildren: () =>
      import('./screens/support-meeting/support-meeting.module').then(
        (m) => m.SupportMeetingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'face-recognization',
    loadChildren: () =>
      import('./screens/face-recognization/face-recognization.module').then(
        (m) => m.FaceRecognizationModule
      ),
  },
  {
    path: 'expert-feedback',
    loadChildren: () =>
      import('./screens/expert-feedback/expert-feedback.module').then(
        (m) => m.ExpertFeedbackModule
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
