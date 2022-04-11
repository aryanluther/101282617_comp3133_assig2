import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { GET_BOOKINGS } from 'src/app/constants';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss']
})
export class BookingHistoryComponent implements OnInit {

  allColumns: string[] = ['id', 'createDate', 'startDate', 'endDate', 'username']

  bookings: any[] = [];

  authenticated = false;

  constructor(private apollo: Apollo, private authService: AuthService, private router: Router) {
    this.authService.getIsAuthenticated().subscribe((res) => {
      this.authenticated = res;
    })

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.getBookings();
      }
    })

    this.getBookings();
   }

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.getBookings();
      }
    })
  }

  getBookings() {
    this.apollo.watchQuery({
      query: GET_BOOKINGS,
      variables: {
        userId: this.authService.getUserId()
      }
    }).valueChanges.subscribe((res: any ) => {
      this.bookings = res.data.getBookingsByUser;
      console.log(this.bookings);
    }, (err) => {
      alert(err);
    });
  }

}
