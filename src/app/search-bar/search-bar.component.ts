import { Component, Output, effect, input, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { SearchInput } from '../input';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    CommonModule
  ],
  styles: `
    .search-bar {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
    }
    .mat-mdc-radio-button ~ .mat-mdc-radio-button {
      margin-left: 16px;
    }
    .mat-mdc-form-field {
      width: 100%;
    }
  `,
  template: `
    <form
      class="search-bar"
      autocomplete="off"
      [formGroup]="searchBar"
      (submit)="submitForm()"
    >
      <mat-form-field>
        <mat-label>Search</mat-label>
        <input matInput placeholder="Query" formControlName="query" required />
        <mat-error *ngIf="query.invalid">Name must be at least 3 characters long.</mat-error>
      </mat-form-field>
      <br />
      <button
        mat-raised-button
        color="primary"
        type="submit"
        [disabled]="searchBar.invalid"
      >
        Search
      </button>
    </form>
  `,
})
export class SearchBarComponent {
  initialState = input<SearchInput>();

  @Output()
  searchSubmitted = new EventEmitter<SearchInput>();

  searchBar = this.formBuilder.group({
    query: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(private formBuilder: FormBuilder) {
    effect(() => {
      this.searchBar.setValue({
        query: this.initialState()?.query || '', 
      });
    });
  }

  get query() {
    return this.searchBar.get('query')!;
  }

  submitForm() {
    try {
      this.searchSubmitted.emit(this.searchBar.value as SearchInput);
    } catch (err) {
      console.log('In error', err);
    }
  }
}
