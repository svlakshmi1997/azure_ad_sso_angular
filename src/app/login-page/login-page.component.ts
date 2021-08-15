import { Component } from '@angular/core';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { HttpServiceHelper } from '../common/HttpServiceHelper';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  private subscription: Subscription;
  loggedIn: boolean = false;

  constructor(private broadcastService: BroadcastService, private authService: MsalService,
    private httpService: HttpServiceHelper, private router: Router) {
    if (this.authService.getUser()) {
      this.loggedIn = true;
      this.getUserProfile();
      this.getAccessToken();
    }
    else {
      this.clearLogin();
    }
  }

  /* Redirect to Azure Login page */
  login() {
    this.authService.loginRedirect();
    this.broadcastService.subscribe("msal:loginFailure", (payload) => {
      this.clearLogin();
    });

    this.broadcastService.subscribe("msal:loginSuccess", (payload) => {
      localStorage.setItem("bi3_access_token", payload["_token"]);
      this.loggedIn = true;
      this.getUserProfile();
      this.getAccessToken();
    });
  }

  /* Get Access token */
  getAccessToken() {
    let urlStorage = "https://management.azure.com//user_impersonation";

    this.subscription = this.broadcastService.subscribe("msal:acquireTokenSuccess", (payload) => {
      if (payload["_token"] != null && payload["_token"] != undefined && payload["_token"] != "") {
        localStorage.setItem("bi3_access_token", payload["_token"]);
        this.loggedIn = true;
        this.router.navigate(["/"]);
      }

    });

    this.authService.acquireTokenSilent(["user.read", urlStorage]).then((token) => {
      if (token != null && token != undefined && token != "") {
        localStorage.setItem("bi3_access_token", token);
        this.loggedIn = true;
        this.router.navigate(["/"]);
      }
    });

    this.subscription = this.broadcastService.subscribe("msal:acquireTokenFailure", (payload) => {
      this.clearLogin();
    });
  }

  /* Get logged in user profile */
  getUserProfile() {
    let url = "https://graph.microsoft.com/v1.0/me";
    this.httpService.httpGetRequest(url)
      .subscribe(data => {
        if (data["displayName"] != null) {
          localStorage.setItem("bi3_user_name", data["displayName"]);
        }
      });
  }

  clearLogin() {
    this.loggedIn = false;
    localStorage.clear();
  }
}
