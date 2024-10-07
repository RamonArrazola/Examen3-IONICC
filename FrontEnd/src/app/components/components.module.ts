import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";

import { HeaderComponent } from "./header/header.component";
import { ListComponent } from "./list/list.component";
import { FormsModule } from "@angular/forms";


@NgModule({
    declarations: [
        HeaderComponent,
        ListComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule
    ],
    exports: [
        HeaderComponent,
        ListComponent
    ]
})
export class ComponentsModule {}