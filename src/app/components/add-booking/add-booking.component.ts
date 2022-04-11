import { Component, OnInit } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { AuthService } from "src/app/services/auth.service";
import { GET_BOOKINGS } from "src/app/constants";

import { Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: "app-add-booking",
  templateUrl: "./add-booking.component.html",
  styleUrls: ["./add-booking.component.scss"],
})
export class AddBookingComponent implements OnInit {
  private add_booking = gql`
    mutation Mutation(
      $userId: String!
      $listingId: String!
      $bookingId: String!
      $bookingStart: String!
      $bookingEnd: String!
      $bookingDate: String!
    ) {
      addBooking(
        userId: $userId
        listing_id: $listingId
        booking_id: $bookingId
        booking_start: $bookingStart
        booking_end: $bookingEnd
        booking_date: $bookingDate
      ) {
        listing_id
        booking_id
        booking_date
        booking_start
        booking_end
        username
      }
    }
  `;

  list: any;

  bookingForm = new FormGroup({
    bookingId: new FormControl(),
    bookingStart: new FormControl(),
    bookingEnd: new FormControl(),
  });

  constructor(
    private router: Router,
    private apo: Apollo,
    private authorize: AuthService
  ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.list = this.router.getCurrentNavigation()?.extras.state?.["list"];
    }
  }

  ngOnInit(): void {}

  addBooking() {
    let tempUserId = this.authorize.getUserId();
    let tempListId = this.list.listing_id;
    let tempDate = Date.now();
    let tempBookingId = this.bookingForm.get("bookingId")?.value;
    let tempStart = this.bookingForm.get("bookingStart")?.value;
    let tempEnd = this.bookingForm.get("bookingEnd")?.value;

    console.log(
      tempUserId,
      tempListId,
      tempDate,
      tempBookingId,
      tempStart,
      tempEnd
    );

    if (
      tempBookingId == null ||
      tempStart == null ||
      tempEnd == null ||
      tempBookingId == ""
    ) {
      alert("Fill the Fields");
    } else {
      if (tempStart > tempEnd) {
        alert("Please Provide proper end date");
      } else {
        let formatStart = moment(tempStart).format("MM-DD-YYYY");
        let formatEnd = moment(tempEnd).format("MM-DD-YYYY");
        let formatDate = moment(tempDate).format("MM-DD-YYYY");
        this.apo
          .mutate({
            mutation: this.add_booking,
            variables: {
              userId: tempUserId,
              listingId: tempListId,
              bookingId: tempBookingId,
              bookingDate: formatDate.toString(),
              bookingStart: formatStart.toString(),
              bookingEnd: formatEnd.toString(),
            },
            refetchQueries: [
              {
                query: GET_BOOKINGS,
                variables: { userId: this.authorize.getUserId() },
              },
            ],
          })
          .subscribe(
            (result: any) => {
              this.router.navigate(["/history"]);
            },
            (error) => {
              alert(error);
            }
          );
      }
    }
  }
}
