import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { GET_ADMIN_LISTINGS } from 'src/app/constants';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  private querySubscription: Subscription | undefined;

  loading: boolean | undefined;

  allColumns: string[] = ['Price', 'Lister', 'Title', 'Description', 'Address'];

  listings: any[] = [];

  authenticated: boolean = false;

  constructor(private router: Router, private apollo: Apollo, private authService: AuthService) {
    this.authService.getIsAuthenticated().subscribe((res) => {
      this.authenticated = res;
    })

    this.getInfo();
   }

  ngOnInit(): void {

        this.getInfo();
  }

  getInfo() {
    this.apollo.watchQuery<any>({
      query: GET_ADMIN_LISTINGS,
      variables: {
       userId: this.authService.getUserId()
      }
    }).valueChanges
      .subscribe((res) => {
        this.listings = res.data.getListingsByAdmin
        console.log(this.listings)
      })
  }

}
