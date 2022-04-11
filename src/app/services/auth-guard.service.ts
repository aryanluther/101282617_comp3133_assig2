import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  authenticated = false;
  adminCheck = false;

  constructor(private authService: AuthService, private router: Router) {
    authService.getIsAuthenticated().subscribe((res) => {
      this.authenticated = res;
    });
    authService.getIsAdmin().subscribe((res) => {
      this.adminCheck = res;
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticated) {
      if (this.adminCheck === false && route.data["roles"] === "admin") {
        // Role is not authorized
        this.router.navigate([""]);
        return false;
      }

      // Authenticated return true
      return true;
    }

    // Not Authenticated
    this.router.navigate(["/login"]);
    return false;
  }
}
