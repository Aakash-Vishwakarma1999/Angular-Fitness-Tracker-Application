import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MaterialModules } from "../material.module";
import { FormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        MaterialModules,
        FormsModule
    ],

    exports: [
        CommonModule,
        MaterialModules,
        FormsModule
    ]
})

export class SharedModule {

}