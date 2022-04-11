import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { USER_TYPE, AUTHENTICATED, USER_ID } from '../constants';

export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private userId: string = '';
  private isAdmin = new BehaviorSubject(false);
  private authenticated = new BehaviorSubject(false);

  constructor(private router: Router) {
  }

  getIsAuthenticated(): Observable<boolean> {
    return this.authenticated.asObservable();
  }

  getIsAdmin(): Observable<boolean> {
    return this.isAdmin.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  setUserData(id: string, type: string) {
    localStorage.setItem(USER_ID, id);
    localStorage.setItem(USER_TYPE, type);
    localStorage.setItem(AUTHENTICATED, 'true');

    this.userId = id;
    if (type === 'admin') {
      this.isAdmin.next(true);
    }
    this.authenticated.next(true);
  }

  logout() {
    localStorage.setItem(USER_ID, '');
    localStorage.setItem(USER_TYPE, '');
    localStorage.setItem(AUTHENTICATED, 'false');

    this.userId = '';

    this.isAdmin.next(false);
    this.authenticated.next(false);

  }


}
