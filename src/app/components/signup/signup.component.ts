import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  private signup = gql`
    mutation Mutation(
      $username: String!
      $firstname: String!
      $lastname: String!
      $password: String!
      $email: String!
      $type: String!
    ) {
      addUser(
        username: $username
        firstname: $firstname
        lastname: $lastname
        password: $password
        email: $email
        type: $type
      ) {
        username
        firstname
        lastname
        password
        email
        type
      }
    }
  `;

  signupForm = new FormGroup({
    username: new FormControl(),
    firstname: new FormControl(),
    lastname: new FormControl(),
    password: new FormControl(),
    email: new FormControl(),
    type: new FormControl(),
  });

  constructor(private router: Router, private apollo: Apollo) {}

  ngOnInit(): void {}

  signUp() {
    let tempUsername = this.signupForm.get("username")?.value;
    let tempFirstname = this.signupForm.get("firstname")?.value;
    let tempLastname = this.signupForm.get("lastname")?.value;
    let tempEmail = this.signupForm.get("email")?.value;
    let tempPassword = this.signupForm.get("password")?.value;
    let tempType = this.signupForm.get("type")?.value;

    if (tempUsername === null) {
      tempUsername = "";
    }
    if (tempFirstname == null) {
      tempFirstname = "";
    }
    if (tempLastname == null) {
      tempLastname = "";
    }
    if (tempEmail == null) {
      tempEmail = "";
    }
    if (tempPassword == null) {
      tempPassword = "";
    }
    if (tempType == null) {
      tempType = "";
    }

    this.apollo
      .mutate({
        mutation: this.signup,
        variables: {
          username: tempUsername,
          firstname: tempFirstname,
          lastname: tempLastname,
          password: tempPassword,
          email: tempEmail,
          type: tempType,
        },
      })
      .subscribe(
        (result: any) => {
          console.log("signup", result.data);
          this.router.navigate(["/login"]);
        },
        (err) => {
          alert(err.message);
        }
      );
  }
}
