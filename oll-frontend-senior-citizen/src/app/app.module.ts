import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WaitingScreenComponent } from './screens/waiting-screen/waiting-screen.component';
import { NoCustomerSupportAvailableComponent } from './screens/no-customer-support-available/no-customer-support-available.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './modules/shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './screens/not-found/not-found.component';
import { UnauthorizedComponent } from './screens/unauthorized/unauthorized.component';
import { ForbiddenComponent } from './screens/forbidden/forbidden.component';
import { TrexWaitingGameComponent } from './screens/trex-waiting-game/trex-waiting-game.component';
import { TokenInterceptor } from '../app/interceptor/token.interceptor';
import { ErrorHandlerInterceptor } from '../app/interceptor/error-handler.interceptor';
import { LoaderInterceptor } from '../app/interceptor/loader.interceptor';
import { PreJoinComponent } from './screens/pre-join/pre-join.component';

@NgModule({
  declarations: [
    AppComponent,
    WaitingScreenComponent,
    NoCustomerSupportAvailableComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    ForbiddenComponent,
    TrexWaitingGameComponent,
    PreJoinComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
