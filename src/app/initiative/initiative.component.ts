import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

interface Option {
  code: number;
  value: string;
}

@Component({
  selector: 'app-initiative',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    TableModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    FormsModule,
  ],
  templateUrl: './initiative.component.html',
  styleUrl: './initiative.component.scss',
})
export class InitiativeComponent implements OnInit {
  public id: number = 0;
  public d20: number | null | undefined = 0;
  public gathered: boolean = false;

  public friendForm = new FormGroup({
    name: new FormControl('', Validators.required),
    initiative: new FormControl<number>(0),
    finalValue: new FormControl<number>(0),
    selectedOption: new FormControl<Option | null>(null),
  });

  public enemyForm = new FormGroup({
    name: new FormControl('', Validators.required),
    initiative: new FormControl<number>(0),
    finalValue: new FormControl<number>(0),
    selectedOption: new FormControl<Option | null>(null),
  });

  public friends: {
    id: number;
    name: string;
    initiative: number;
    value: number | null | undefined;
    type: number;
  }[] = [];

  public enemies: {
    id: number;
    name: string;
    initiative: number;
    value: number | null | undefined;
    type: number;
  }[] = [];

  public combined = [...this.friends, ...this.enemies];

  public options: Option[] | undefined;

  ngOnInit() {
    this.options = [
      { code: 0, value: 'Valor final' },
      { code: 1, value: 'Rolar dado' },
    ];
  }

  onSubmitFriend() {
    if (this.friendForm.value.selectedOption?.code) {
      this.d20 =
        Math.floor(Math.random() * 20) +
        1 +
        (this.friendForm.value.initiative ?? 0);
    } else {
      this.d20 = this.friendForm.value.finalValue;
    }
    this.friends.push({
      id: this.id,
      name: this.friendForm.value.name ?? '',
      initiative: this.friendForm.value.initiative ?? 0,
      value: this.d20,
      type: 1,
    });
    this.combined = [...this.friends, ...this.enemies];
    this.id++;
    this.sortfriends();
    console.warn(this.friendForm.value);
  }

  onSubmitEnemy() {
    if (this.enemyForm.value.selectedOption?.code) {
      this.d20 =
        Math.floor(Math.random() * 20) +
        1 +
        (this.enemyForm.value.initiative ?? 0);
    } else {
      this.d20 = this.enemyForm.value.finalValue;
    }
    this.enemies.push({
      id: this.id,
      name: this.enemyForm.value.name ?? '',
      initiative: this.enemyForm.value.initiative ?? 0,
      value: this.d20,
      type: 0,
    });
    this.id++;
    this.combined = [...this.friends, ...this.enemies];
    this.sortEnemies();
    console.warn(this.enemyForm.value);
  }

  sortfriends(): void {
    this.friends.sort((a, b) => {
      const aValue = a.value ?? 0;
      const bValue = b.value ?? 0;

      if (bValue !== aValue) {
        return bValue - aValue;
      }
      return (b.initiative ?? 0) - (a.initiative ?? 0);
    });
  }

  sortEnemies(): void {
    this.enemies.sort((a, b) => {
      const aValue = a.value ?? 0;
      const bValue = b.value ?? 0;

      if (bValue !== aValue) {
        return bValue - aValue;
      }
      return (b.initiative ?? 0) - (a.initiative ?? 0);
    });
  }

  gather() {
    this.gathered = !this.gathered;

    if (this.gathered) {
      this.combined.sort((a, b) => {
        const aValue = a.value ?? 0;
        const bValue = b.value ?? 0;

        if (bValue !== aValue) {
          return bValue - aValue;
        }
        return (b.initiative ?? 0) - (a.initiative ?? 0);
      });

      console.log('Ordenado:', this.combined);
    }
  }
}
