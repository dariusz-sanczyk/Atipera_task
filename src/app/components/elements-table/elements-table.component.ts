import { Component, inject, OnInit, computed } from '@angular/core';
import { PeriodicElement } from '../../models/element.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { ElementsStore } from '../../store/elements.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [MatTableModule, MatInputModule, ReactiveFormsModule, NgFor],
  templateUrl: './elements-table.component.html',
  styleUrls: ['./elements-table.component.scss'],
  providers: [ElementsStore]
})
export class ElementsTableComponent implements OnInit {
  public columnsToDisplay: string[] = ['position', 'name', 'weight', 'symbol'];
  public filterControl = new FormControl('');
  readonly dialog = inject(MatDialog);
  readonly elementsStore = inject(ElementsStore);

  // Convert filter Observable to Signal
  private filterSignal = toSignal(
    this.filterControl.valueChanges.pipe(
      startWith(''),
      debounceTime(2000),
      map((value) => (value ?? '').trim().toLowerCase())
    ),
    { initialValue: '' }
  );

  // Computed signal for filtered data
  public dataSource = computed(() => {
    const elements = this.elementsStore.elements();
    const filter = this.filterSignal();

    if (!filter) {
      return elements;
    }

    return elements.filter((element) =>
      Object.values(element)
        .join(' ')
        .toLowerCase()
        .includes(filter)
    );
  });
  constructor() {}

  ngOnInit(): void {
    // Initialization logic if needed
  }

  public getColumnName(column: string): string {
    switch (column) {
      case 'position':
        return 'Number';
      case 'name':
        return 'Name';
      case 'weight':
        return 'Weight';
      case 'symbol':
        return 'Symbol';
      default:
        return '';
    }
  }

  public openEditDialog(column: string, element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { column, element },
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.elementsStore.updateElement(column, element, value);
      }
    });
  }
}