import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BroadcastService } from "@azure/msal-angular";
import { MsalService } from "@azure/msal-angular";
import { Subscription } from "rxjs/Subscription";
import { Router } from '@angular/router';
import { GetSubscriptionsService } from '../service/get-subscriptions.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  displayName = null;
  bi3_access_token = null;
  private subscription: Subscription;
  subscriptionList: any = [];

  constructor(private broadcastService: BroadcastService, private authService: MsalService,
    private router: Router, private getSubscriptionsService: GetSubscriptionsService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.bi3_access_token = localStorage.getItem("bi3_access_token");
  }

  ngOnInit() {
    /* If not logged in then redirect to login page */
    if (this.bi3_access_token == null || this.bi3_access_token == undefined || this.bi3_access_token == "") {
      this.router.navigate(["/login"]);
    }
    else {
      setTimeout(() => {
        this.displayName = localStorage.getItem("bi3_user_name");
        this.changeDetectorRef.detectChanges();
      }, 1500);
      this.getSubsciptionList();
    }
  }

  /* Call Get Subscriptions - List Service */
  getSubsciptionList() {
    this.getSubscriptionsService.getSubscription(this.bi3_access_token)
      .subscribe(
        data => {
          this.subscriptionList = data["value"];
        },
        error => {
          console.log("error ", error);
        });
  }

  ngOnDestroy() {
    this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /* Logout the user from the application and Azure */
  logout() {
    this.authService.logout();
    localStorage.clear();
  }
}
