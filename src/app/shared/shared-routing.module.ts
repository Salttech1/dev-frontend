import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodeHelpComponent } from './generic/code-help/code-help.component';
import { FavouriteComponent } from './generic/favourite/favourite.component';

const routes: Routes = [
  { path: 'codehelp', component: CodeHelpComponent },
  { path: 'favourite', title: 'Favourite', component: FavouriteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
