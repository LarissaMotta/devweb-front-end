import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { endpoints } from "../routes/user.route";
import { Observable } from "rxjs";
import { BaseService } from "./base.service";
import User from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService extends BaseService<User> {
  constructor(protected http: HttpClient) {
    super(http, endpoints.baseUrl);
  }

  getByEmail(email: string): Observable<User> {
    return this.http.get<User>(
      endpoints.getUserByEmail.replace("{email}", email),
      this.httpOptions
    );
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(
      endpoints.getUserById.replace("{id}", id.toString()),
      this.httpOptions
    );
  }

  updateState(id: number, active: boolean): Observable<void> {
    return this.http.put<void>(
      endpoints.active.replace("{id}", id.toString()),
      { active },
      this.httpOptions
    );
  }
}
