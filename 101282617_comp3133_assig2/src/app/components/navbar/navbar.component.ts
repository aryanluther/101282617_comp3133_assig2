import { Component, OnInit } from "@angular/core";

import { AuthService } from "src/app/services/auth.service";
import { distinctUntilChanged } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  loggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private autherize: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.autherize
      .getIsAuthenticated()
      .pipe(distinctUntilChanged())
      .subscribe((getIsAuthenticated) => {
        this.loggedIn = getIsAuthenticated;
      });

    this.autherize
      .getIsAdmin()
      .pipe(distinctUntilChanged())
      .subscribe((data) => {
        this.isAdmin = data;
        console.log("Admin Check ", this.isAdmin);
      });
  }

  logout() {
    this.autherize.logout();
    this.router.navigate([""]);
  }
}
