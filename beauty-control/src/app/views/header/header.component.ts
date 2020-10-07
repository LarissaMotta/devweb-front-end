import { UserService } from "./../../services/user.service";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import * as M from "materialize-css";
import { AuthService } from "src/app/services/auth.service";
import { Observable, Subscription } from "rxjs";
import { Role } from "src/app/enums/role.enum";
import User from "src/app/models/user.model";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  logoSrc: string;
  avatarDefaultSrc: string;
  currentUser: User;
  isLoggedIn$: Observable<boolean>;

  private subscription: Subscription;

  @ViewChild("sidenav") sidenavElem: ElementRef;
  @ViewChild("userTooltip") tooltipElem: ElementRef;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.logoSrc = "assets/logos/icon-beautycontrol-white.png";
    this.avatarDefaultSrc = "assets/usuarios/usuario-sem-avatar.jpg";
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.subscription = this.userService.currentUser.subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.initMaterializeComponents();
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === Role.ADMIN;
  }

  get userAvatar(): string {
    return this.currentUser?.avatar
      ? this.currentUser.avatar
      : this.avatarDefaultSrc;
  }

  get titleInfoUser(): string {
    return `${this.currentUser?.name} - ${this.currentUser?.email}`;
  }

  onLogout(): void {
    this.authService.logout();
  }

  private initMaterializeComponents(): void {
    setTimeout(() => {
      M.Sidenav.init(this.sidenavElem.nativeElement, {});
      M.Tooltip.init(this.tooltipElem.nativeElement, {
        html: `${this.currentUser.name}<br>${this.currentUser.email}`,
        margin: 0,
      });
    }, 250);
  }
}
