import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { endpoints } from "../routes/user.route";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import User from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService extends ApiService<User> {
  private currentUserValue: Observable<User>;

  constructor(protected http: HttpClient) {
    super(http, endpoints.baseUrl);
    this.currentUserValue = this.http.get<User>(
      endpoints.getCurrentUser,
      this.httpOptions
    );
  }

  get currentUser(): Observable<User> {
    return this.currentUserValue;
  }

  getByEmail(email: string): Observable<User> {
    return this.http.get<User>(
      endpoints.getUserByEmail.replace("{email}", email),
      this.httpOptions
    );
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(
      endpoints.getUserById.replace("{id}", id),
      this.httpOptions
    );
  }
}
