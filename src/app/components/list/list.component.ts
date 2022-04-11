import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Apollo, gql } from "apollo-angular";
import { FormGroup, FormControl } from "@angular/forms";
import { GET_LISTINGS } from "src/app/constants";
import {
  Router,
  NavigationExtras,
  NavigationEnd,
  Event,
} from "@angular/router";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  searchForm = new FormGroup({
    search: new FormControl(),
    condition: new FormControl(),
  });

  Columns: string[] = ["Price", "Lister", "Title", "Description", "Address"];
  UserCol: string[] = [
    "Price",
    "Lister",
    "Title",
    "Description",
    "Address",
    "Book",
  ];

  authenticated = false;

  listings: any[] = [];

  constructor(
    private apo: Apollo,
    private authroize: AuthService,
    private router: Router
  ) {
    this.authroize.getIsAuthenticated().subscribe((result) => {
      this.authenticated = result;
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.getListings();
      }
    });

    this.getListings();
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.getListings();
      }
    });
  }

  getListings() {
    this.apo
      .watchQuery({
        query: GET_LISTINGS,
      })
      .valueChanges.subscribe((res: any) => {
        this.listings = res.data.getListings;
        console.log(this.listings);
      });
  }

  search() {
    let tempSearch = this.searchForm.get("search")?.value;
    let tempCondition = this.searchForm.get("condition")?.value;

    console.log(tempSearch, tempCondition);

    if (tempSearch == null || tempCondition == null) {
      alert("Search Error: Please fill in fields");
    }
  }

  searchName(search: any) {
    this.apo
      .watchQuery({
        query: gql`
          query Query($name: String!) {
            getListingsByName(name: $name) {
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
        `,
        variables: {
          name: search,
        },
      })
      .valueChanges.subscribe((result: any) => {
        this.listings = result?.data?.getListingsByName;
      });
  }

  searchCity(search: any) {
    this.apo
      .watchQuery({
        query: gql`
          query GetListingsByCity($city: String!) {
            getListingsByCity(city: $city) {
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
        `,
        variables: {
          city: search,
        },
      })
      .valueChanges.subscribe((result: any) => {
        this.listings = result?.data?.getListingsByCity;
      });
  }

  searchPostalCode(search: any) {
    this.apo
      .watchQuery({
        query: gql`
          query Query($postalCode: String!) {
            getListingsByPosCode(postal_code: $postalCode) {
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
        `,
        variables: {
          postalCode: search,
        },
      })
      .valueChanges.subscribe((result: any) => {
        this.listings = result?.data?.getListingsByPosCode;
      });
  }

  addBooking(index: any) {
    let navExtras: NavigationExtras = {
      state: {
        list: this.listings[index],
      },
    };
    this.router.navigate(["/addBook"], navExtras);
  }
}
