import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LargeLoaderComponent } from "src/app/loaders/large/large.component";
import { SmallLoaderComponent } from "src/app/loaders/small-loader/small-loader.component";
import { ForbiddenComponent } from 'src/app/components/forbidden/forbidden.component';

@NgModule({
  declarations: [LargeLoaderComponent, SmallLoaderComponent,  ForbiddenComponent],
  imports: [CommonModule],
  exports: [LargeLoaderComponent, SmallLoaderComponent, ForbiddenComponent]
})
export class CoreModule {}
