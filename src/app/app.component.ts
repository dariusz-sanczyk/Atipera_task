import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElementsTableComponent } from "./components/elements-table/elements-table.component";
import { MatDialog } from '@angular/material/dialog';
import { IntroComponent } from './components/intro/intro.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ElementsTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AtiperaTask';

  constructor(private dialogRef: MatDialog) {
    this.dialogRef.open(IntroComponent);
  }
}
