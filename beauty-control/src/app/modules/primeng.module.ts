import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputMaskModule } from "primeng/inputmask";
import { PasswordModule } from "primeng/password";
import { DropdownModule } from "primeng/dropdown";
import { RadioButtonModule } from "primeng/radiobutton";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ToastModule } from "primeng/toast";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DataViewModule } from "primeng/dataview";
import { RatingModule } from "primeng/rating";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { CalendarModule } from "primeng/calendar";
import { AccordionModule } from "primeng/accordion";
import { SelectButtonModule } from "primeng/selectbutton";
import { FileUploadModule } from "primeng/fileupload";
import { PanelModule } from "primeng/panel";
import { MenuModule } from "primeng/menu";
import { ProgressBarModule } from "primeng/progressbar";

import { MessageService } from "primeng/api";
import { ConfirmationService } from "primeng/api";

@NgModule({
  imports: [],
  exports: [
    TableModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    InputMaskModule,
    PasswordModule,
    DropdownModule,
    RadioButtonModule,
    ButtonModule,
    CardModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    ConfirmDialogModule,
    DialogModule,
    DataViewModule,
    RatingModule,
    CommonModule,
    DynamicDialogModule,
    CalendarModule,
    AccordionModule,
    SelectButtonModule,
    FileUploadModule,
    PanelModule,
    MenuModule,
    ProgressBarModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class PrimengModule {}
