import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './modules/shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './screens/not-found/not-found.component';
import { UnauthorizedComponent } from './screens/unauthorized/unauthorized.component';
import { ForbiddenComponent } from './screens/forbidden/forbidden.component';
import { TokenInterceptor } from '../app/interceptor/token.interceptor';
import { ErrorHandlerInterceptor } from '../app/interceptor/error-handler.interceptor';
import { LoaderInterceptor } from '../app/interceptor/loader.interceptor';
import { PreJoinComponent } from './screens/pre-join/pre-join.component';
import { ExpertFeedbackComponent } from './screens/expert-feedback/expert-feedback.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    ForbiddenComponent,
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
