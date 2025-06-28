import { Component, inject, OnInit } from '@angular/core';
import { PeriodicElement } from '../../models/element.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { ElementsService } from '../../services/elements.service';
import { RxState } from '@rx-angular/state';
import { combineLatest, Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [MatTableModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './elements-table.component.html',
  styleUrls: ['./elements-table.component.scss'],
  providers: [RxState],
})
export class ElementsTableComponent implements OnInit {
  public columnsToDisplay: string[] = ['position', 'name', 'weight', 'symbol'];
  public filterControl = new FormControl('');
  public dataSource$!: Observable<PeriodicElement[]>;
  readonly dialog = inject(MatDialog);

  constructor(
    private elementsService: ElementsService,
    private state: RxState<{ elements: PeriodicElement[], filter: string }>
  ) {
    this.state.set({ elements: [], filter: '' });
    this.state.connect('elements', this.elementsService.elements$);

    this.state.connect(
      'filter',
      this.filterControl.valueChanges.pipe(
        startWith(''),
        debounceTime(2000),
        map((value) => (value ?? '').trim().toLowerCase())
      )
    );
  };

  ngOnInit(): void {

    this.dataSource$ = combineLatest([
      this.elementsService.elements$,
      this.state.select('filter'),
    ]).pipe(
      map(([elements, filter]) => {
        if (!filter) {
          return elements;
        }
        return elements.filter((element) =>
          Object.values(element)
            .join(' ')
            .toLowerCase()
            .includes(filter)
        );
      })
    );
  };

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
    };
  };

  public openEditDialog(column: string, element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { column, element },
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.elementsService.updateElement(column, element, value);
      };
    });
  };
};
