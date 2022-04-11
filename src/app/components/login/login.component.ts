import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  private LOGIN_POST = gql`
    mutation Mutation($username: String!, $password: String!) {
      login(username: $username, password: $password)
    }
  `;

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  constructor(
    private apo: Apollo,
    private router: Router,
    private authorize: AuthService
  ) {}

  ngOnInit(): void {}

  login() {
    let tempUsername = this.loginForm.get("username")?.value;
    let tempPassword = this.loginForm.get("password")?.value;

    console.log(tempUsername, tempPassword);

    this.apo
      .mutate({
        mutation: this.LOGIN_POST,
        variables: {
          username: tempUsername,
          password: tempPassword,
        },
      })
      .subscribe(
        (result: any) => {
          if (result.data.login === null || result.data.login === undefined) {
            alert(new Error("Please fill Correct username and password"));
          } else {
            this.authorize.setUserData(
              result.data.login[0],
              result.data.login[5]
            );
            this.router.navigate([""]);
          }
        },
        (err) => {
          alert(err.message);
        }
      );
  }
}
