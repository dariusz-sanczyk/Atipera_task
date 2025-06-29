import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputData } from '../../models/input-data.model';
import { InputStateMatcher } from '../../utils/ErrorStateMatcher';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    NgIf],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<EditDialogComponent>);
  readonly data = inject<InputData>(MAT_DIALOG_DATA);
  public value!: string | number;
  public valueType: string = '';
  public inputForm!: FormGroup;
  matcher = new InputStateMatcher();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      position: [
        '',
        [Validators.pattern('^[0-9]+$')]
      ],
      name: [
        '',
        [Validators.pattern('^[a-zA-Z]+$')]
      ],
      weight: [
        '',
        [Validators.pattern('^[0-9]+\.[0-9]{1,4}$')]
      ],
      symbol: [
        '',
        [Validators.maxLength(2), Validators.pattern('^[a-zA-Z]+$')]
      ],
    })

  };

  onCancel(): void {
    this.dialogRef.close();
  };
};
