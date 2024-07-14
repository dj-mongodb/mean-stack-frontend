import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchInput } from '../input';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [
    SearchBarComponent,
    MatCardModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterModule,
    FormsModule,
  ],
  styles: [
    `
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
      }
      th {
        background-color: #f2f2f2;
        text-align: left;
      }
      .header-button {
        float: right;
        margin-left: auto;
      }
      .checkbox-group {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
      }
    `,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Search</mat-card-title>
        <button mat-raised-button color="primary" [routerLink]="['/']" class="header-button">
          Go to Home
        </button>
      </mat-card-header>
      <mat-card-content>
        <app-search-bar (searchSubmitted)="searchBox($event)"></app-search-bar>
        <div class="checkbox-group">
          <mat-checkbox [(ngModel)]="seniorityLevels.junior">Junior</mat-checkbox>
          <mat-checkbox [(ngModel)]="seniorityLevels.mid">Mid</mat-checkbox>
          <mat-checkbox [(ngModel)]="seniorityLevels.senior">Senior</mat-checkbox>
        </div>
        <div *ngIf="employees && employees.length > 0">
          <h3>Search Results:</h3>
          <table mat-table [dataSource]="employees">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let element">{{ element.name }}</td>
            </ng-container>
            <ng-container matColumnDef="position">
              <th mat-header-cell *matHeaderCellDef>Position</th>
              <td mat-cell *matCellDef="let element">{{ element.position }}</td>
            </ng-container>
            <ng-container matColumnDef="seniority">
              <th mat-header-cell *matHeaderCellDef>Seniority</th>
              <td mat-cell *matCellDef="let element">{{ element.level }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class SearchBoxComponent {
  employees: any[] = [];
  displayedColumns: string[] = ['name', 'position', 'seniority'];
  seniorityLevels = {
    junior: false,
    mid: false,
    senior: false,
  };

  constructor(private employeeService: EmployeeService) {}

  searchBox(query: SearchInput) {
    query.seniority = (Object.keys(this.seniorityLevels) as Array<keyof typeof this.seniorityLevels>)
      .filter(level => this.seniorityLevels[level]);

    this.employeeService.searchEmployee(query).subscribe({
      next: (response: any[]) => {
        this.employees = response;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }
}
