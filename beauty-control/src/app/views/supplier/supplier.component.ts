import { AuthService } from "src/app/services/auth.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { SupplierService } from "src/app/services/supplier.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { ConfirmationService } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";
import { normalizeFormLayout } from "src/app/utils/form-normalized.util";
import { Subscription, Observable, Subscriber } from "rxjs";
import { UserSupplierRating } from "src/app/models/user-supplier-rating.model";
import User from "src/app/models/user.model";
import Supplier from "src/app/models/supplier.model";

@Component({
  selector: "app-supplier",
  templateUrl: "./supplier.component.html",
  styleUrls: ["./supplier.component.scss"],
})
export class SupplierComponent implements OnInit, OnDestroy {
  suppliers: Supplier[];
  selectedSupplier: Supplier;
  handleSupplier: Supplier;
  showSupplierDialog: boolean;
  formSubmitted: boolean;
  isNewSupplier: boolean;

  currentUser: User;

  private subscriptions: Subscription[];

  constructor(
    private supplierService: SupplierService,
    private toastMessageService: ToastMessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {
    this.subscriptions = new Array<Subscription>();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.supplierService.getAll().subscribe({
        next: (data: Supplier[]) =>
          (this.suppliers = this.supplierService.sort(data, "name")),
        error: (error: HttpErrorResponse) =>
          this.toastMessageService.showToastError(error.error.message),
      })
    );
    this.subscriptions.push(
      this.authService.currentUser.subscribe({
        next: (user: User) => {
          this.currentUser = user;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => x.unsubscribe());
  }

  onRowSelect(): void {
    this.handleSupplier = { ...this.selectedSupplier };
    this.supplierService
      .getRateSupplier(this.selectedSupplier.id, this.currentUser.id)
      .subscribe({
        next: (userSupplierRating: UserSupplierRating) =>
          (this.handleSupplier.rating = userSupplierRating.rating),
        error: (error: HttpErrorResponse) =>
          this.toastMessageService.showToastError(error.error.message),
      });
    this.isNewSupplier = false;
    this.showSupplierDialog = true;
    normalizeFormLayout();
  }

  hideDialog(): void {
    this.showSupplierDialog = false;
    this.formSubmitted = false;
  }

  onClickBtnCreate(): void {
    this.handleSupplier = new Supplier();
    this.isNewSupplier = true;
    this.formSubmitted = false;
    this.showSupplierDialog = true;
    normalizeFormLayout();
  }

  onClickBtnDelete(supplier: Supplier): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar o fornecedor ${supplier.name}?`,
      header: "Atenção",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteSupplier(supplier);
      },
    });
  }

  saveSupplier(): void {
    this.formSubmitted = true;
    let isValid: boolean = this.isValidForm(this.handleSupplier);

    if (isValid) {
      this.createOrUpdateSupplier();
      this.hideDialog();
      this.handleSupplier = new Supplier();
    }
  }

  createOrUpdateSupplier(): void {
    this.normalizeTelphone();
    if (this.isNewSupplier) {
      this.createSupplier(this.handleSupplier);
    } else {
      this.updateSupplier(this.handleSupplier);
    }
  }

  createSupplier(supplier: Supplier): void {
    this.supplierService.create(supplier).subscribe({
      next: (supplierCreated: Supplier) => {
        this.suppliers.push(supplierCreated);
        this.suppliers = this.supplierService.sort([...this.suppliers], "name");
        this.toastMessageService.showToastSuccess(
          "Fornecedor criado com sucesso."
        );
        this.rateSupplier(supplierCreated, supplier.rating);
      },
      error: (error: HttpErrorResponse) =>
        this.toastMessageService.showToastError(error.error.message),
    });
  }

  updateSupplier(supplier: Supplier): void {
    this.supplierService.update(supplier, supplier.id).subscribe({
      next: (supplierUpdated: Supplier) => {
        let supplierIndex: number = this.suppliers.findIndex(
          (val: Supplier, i: number) => val.id == supplier.id
        );
        this.suppliers[supplierIndex] = supplierUpdated;
        this.suppliers = this.supplierService.sort([...this.suppliers], "name");
        this.toastMessageService.showToastSuccess(
          "Fornecedor atualizado com sucesso."
        );
        this.rateSupplier(supplierUpdated, supplier.rating);
      },
      error: (error: HttpErrorResponse) =>
        this.toastMessageService.showToastError(error.error.message),
    });
  }

  deleteSupplier(supplier: Supplier): void {
    this.supplierService.delete(supplier.id).subscribe({
      next: () => {
        this.suppliers = this.suppliers.filter((val) => val.id !== supplier.id);
        this.handleSupplier = new Supplier();
        this.toastMessageService.showToastSuccess(
          "Fornecedor deletado com sucesso."
        );
      },
      error: (error: HttpErrorResponse) =>
        this.toastMessageService.showToastError(error.error.message),
    });
  }

  normalizeNumberFields(): void {
    if (!this.handleSupplier.rating) {
      this.handleSupplier.rating = 0;
    }
  }

  setMaskPhoneNumber(supplier: Supplier): string {
    const phoneNumber: string = supplier.telephone;

    if (phoneNumber) {
      return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(
        2,
        7
      )}-${phoneNumber.substring(7, 11)}`;
    }

    return "";
  }

  private isValidForm(supplier: Supplier): boolean {
    if (!supplier.name.trim() || supplier.rating < 0) {
      return false;
    } else {
      return true;
    }
  }

  private normalizeTelphone(): void {
    this.handleSupplier.telephone = this.handleSupplier.telephone.replace(
      /[() -]/g,
      ""
    );
  }

  private rateSupplier(supplier: Supplier, ratingValue: number): void {
    const rating = new UserSupplierRating(
      supplier.rating,
      this.currentUser,
      supplier
    );
    this.supplierService.rateSupplier(rating).subscribe({
      error: (error: HttpErrorResponse) =>
        this.toastMessageService.showToastError(error.error.message),
    });
  }
}
