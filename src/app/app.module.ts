import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HttpServiceHelper } from './common/HttpServiceHelper';


export function loggerCallback(logLevel, message, piiEnabled) {
}

export const protectedResourceMap: [string, string[]][] = [['https://graph.microsoft.com/v1.0/me', ['user.read']], ['https://management.azure.com', ['https://management.azure.com//user_impersonation']]];

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    /* Configure App Registration credentials */
    MsalModule.forRoot({
      clientID: "<replace-your-client-id>",
      authority: "https://login.microsoftonline.com/<replace-your-tenant-id>",
      validateAuthority: true,
      redirectUri: "http://localhost:4200/",
      cacheLocation: "localStorage",
      storeAuthStateInCookie: isIE,
      postLogoutRedirectUri: "http://localhost:4200/",
      navigateToLoginRequestUrl: true,
      popUp: false,
      consentScopes: ["user.read", "https://management.azure.com//user_impersonation"],
      unprotectedResources: ["https://www.microsoft.com/en-us/"],
      protectedResourceMap: protectedResourceMap,
      logger: loggerCallback,
      correlationId: '1234',
      piiLoggingEnabled: true,
    }),
    HttpClientModule
  ],
  providers: [HttpServiceHelper,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }