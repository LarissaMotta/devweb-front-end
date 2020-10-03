import { Component, OnInit } from "@angular/core";
import { ProductService } from "src/app/services/product.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ConfirmationService } from "primeng/api";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { normalizeFormLayout } from "src/app/utils/form-normalized.util";
import { productDict } from 'src/app/dicts/product.dict';
import Product from "src/app/models/product.model";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  srcImage: string;
  products: Product[];
  selectedProduct: Product;
  handleProduct: Product;
  showProductDialog: boolean;
  formSubmitted: boolean;
  isNewProduct: boolean;

  constructor(
    private productService: ProductService,
    private toastMessageService: ToastMessageService,
    private confirmationService: ConfirmationService
  ) {
    this.srcImage = "assets/produto/produto-sem-imagem.png";
  }

  get categoryDict(): any {
    return productDict.category;
  }

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (products: Product[]) => this.products = products,
      error: (error: HttpErrorResponse) =>
        this.toastMessageService.showToastError(error.message),
    });
  }

  onProductSelect(product: Product): void {
    this.handleProduct = { ...product };
    this.isNewProduct = false;
    this.showProductDialog = true;
    normalizeFormLayout();
  }

  hideDialog(): void {
    this.showProductDialog = false;
    this.formSubmitted = false;
  }

  onClickBtnCreate(): void {
    this.handleProduct = new Product();
    this.isNewProduct = true;
    this.formSubmitted = false;
    this.showProductDialog = true;
    normalizeFormLayout();
  }

  onClickBtnDelete(product: Product): void {
    this.confirmationService.confirm({
      header: "Atenção",
      message: `Tem certeza que deseja deletar o produto ${product.name}?`,
      acceptLabel: "Sim",
      rejectLabel: "Não",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteProduct(product);
      },
    });
  }

  saveProduct(): void {
    this.formSubmitted = true;
    let isValid: boolean = this.isValidForm(this.handleProduct);

    if (isValid) {
      this.createOrUpdateProduct();
      this.hideDialog();
      this.handleProduct = new Product();
    }
  }

  createOrUpdateProduct(): void {
    if (this.isNewProduct) {
      this.createProduct(this.handleProduct);
    } else {
      this.updateProduct(this.handleProduct);
    }
  }

  createProduct(product: Product): void {
    this.productService.create(product).subscribe({
      next: (productCreated: Product) => {
        this.products.push(productCreated);
        this.products = [...this.products];
        this.toastMessageService.showToastSuccess(
          "Produto criado com sucesso."
        );
      },
      error: (error: HttpErrorResponse) => {
        this.toastMessageService.showToastError(error.error.message);
      }
    });
  }

  updateProduct(product: Product): void {
    this.productService.update(product, product.id).subscribe({
      next: (productUpdated: Product) => {
        let productIndex: number = this.products.findIndex(
          (val: Product, i: number) => val.id == product.id
        );
        this.products[productIndex] = productUpdated;
        this.products = [...this.products];
        this.toastMessageService.showToastSuccess(
          "Produto atualizado com sucesso."
        );
      },
      error: (error: HttpErrorResponse) =>
        this.toastMessageService.showToastError(error.message),
    });
  }

  deleteProduct(product: Product): void {
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.products = this.products.filter((val) => val.id !== product.id);
        this.handleProduct = new Product();
        this.toastMessageService.showToastSuccess(
          "Produto deletado com sucesso."
        );
      },
      error: (error: HttpErrorResponse) =>
        this.toastMessageService.showToastError(error.message),
    });
  }

  normalizeNumberFields(): void {
    if (!this.handleProduct.quantity) {
      this.handleProduct.quantity = 0;
    }
  }

  private isValidForm(product: Product): boolean {
    if (!product.name.trim() || product.quantity < 0 || !product.category) {
      return false;
    } else {
      return true;
    }
  }
}
