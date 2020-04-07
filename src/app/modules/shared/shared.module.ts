import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { HeaderComponent } from "../../components/header/header.component";
// import { LargeLoaderComponent } from "src/app/loaders/large/large.component";
import { NoContentComponent } from "src/app/components/no-content/no-content.component";
// import { SmallLoaderComponent } from "src/app/loaders/small-loader/small-loader.component";
import { CoreModule } from "../coreModule/core/core.module";

@NgModule({
  declarations: [SidebarComponent, HeaderComponent, NoContentComponent],
  imports: [CommonModule, CoreModule],
  exports: [SidebarComponent, HeaderComponent, NoContentComponent]
})
export class SharedModule {}
