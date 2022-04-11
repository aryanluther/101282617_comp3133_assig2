import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddBookingComponent } from "./components/add-booking/add-booking.component";
import { AddListingComponent } from "./components/add-listing/add-listing.component";
import { AdminComponent } from "./components/admin/admin.component";
import { BookingHistoryComponent } from "./components/booking-history/booking-history.component";
import { HomeComponent } from "./components/home/home.component";
import { ListComponent } from "./components/list/list.component";
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { AuthGuardService } from "./services/auth-guard.service";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "list",
    component: ListComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "history",
    component: BookingHistoryComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AuthGuardService],
    data: { roles: "admin" },
  },
  {
    path: "addBook",
    component: AddBookingComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "addList",
    component: AddListingComponent,
    canActivate: [AuthGuardService],
    data: { roles: "admin" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
