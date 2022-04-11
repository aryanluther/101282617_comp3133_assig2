import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from 'src/app/services/auth.service';
import { GET_ADMIN_LISTINGS, GET_LISTINGS } from 'src/app/constants';

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.scss']
})
export class AddListingComponent implements OnInit {

  private ADD_LISTING = gql`
    mutation Mutation(
      $userId: String!,
      $listingId: String!,
      $listingTitle: String!,
      $description: String!,
      $street: String!,
      $city: String!,
      $postalCode: String!,
      $price: Float!) {
    addListing(
        userId: $userId,
        listing_id: $listingId,
        listing_title: $listingTitle,
        description: $description,
        street: $street,
        city: $city,
        postal_code: $postalCode,
        price: $price)
      {
          listing_id
          listing_title
          description
          street
          city
          postal_code
          price
          email
          username
      }
    }
  `

  listForm =  new FormGroup({
    listingId: new FormControl(),
    listingTitle: new FormControl(),
    description: new FormControl(),
    street: new FormControl(),
    city: new FormControl(),
    postalCode: new FormControl(),
    price: new FormControl()
  });

  constructor(private router: Router, private apollo: Apollo, private authService: AuthService) { }

  ngOnInit(): void {
  }

  addListing() {
    let tempUserId = this.authService.getUserId();
    let tempListId = this.listForm.get('listingId')?.value;
    let tempTitle = this.listForm.get('listingTitle')?.value;
    let tempDesc = this.listForm.get('description')?.value;
    let tempStreet = this.listForm.get('street')?.value;
    let tempCity = this.listForm.get('city')?.value;
    let tempPosCode = this.listForm.get('postalCode')?.value;
    let tempPrice = this.listForm.get('price')?.value;
    let parsedPrice;

    if (tempListId == null) {
      tempListId = ''
    }
    if (tempTitle == null) {
      tempTitle = ''
    }
    if (tempDesc == null) {
      tempDesc = ''
    }
    if (tempStreet == null) {
      tempStreet = ''
    }
    if (tempCity == null) {
      tempCity = ''
    }
    if (tempPosCode == null) {
      tempPosCode = ''
    }

    if (isNaN(tempPrice)){
      alert('Price must be a number.')
    } else {
      parsedPrice = parseFloat(tempPrice);

      this.apollo.mutate({
        mutation: this.ADD_LISTING,
        variables: {
          userId: tempUserId,
          listingId: tempListId,
          listingTitle: tempTitle,
          description: tempDesc,
          street: tempStreet,
          city: tempCity,
          postalCode: tempPosCode,
          price: parsedPrice
        },
        refetchQueries: [
          {
            query: GET_ADMIN_LISTINGS,
            variables: {userId: this.authService.getUserId()}
          },
          {
            query: GET_LISTINGS
          }
        ]
      }).subscribe((res: any) => {
        console.log('got data', res);
          this.router.navigate(['/admin'])
      }, (err) => {
        alert(err);
      })
    }
  }

}
