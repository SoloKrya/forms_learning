import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-check-box-form',
  imports: [ReactiveFormsModule],
  templateUrl: './check-box-form.html',
  styleUrl: './check-box-form.scss'
})
export class CheckBoxForm {
  private fb = inject(FormBuilder);
  topicsAll = ['Angular', 'RxJS', 'NgRx', 'Node.js'];

  minArrayLength = (min: number): ValidatorFn =>
    (ac: AbstractControl): ValidationErrors | null => {
      const arr = (ac.value ?? []);
      return Array.isArray(arr) && arr.length >= min ? null : { minLengthArray: { required: min, actual: arr?.length ?? 0 } };
    };

  form = this.fb.nonNullable.group({
    topics: this.fb.nonNullable.control<string[]>([], [this.minArrayLength(1)]),
  });

  get topicsCtrl() { return this.form.controls.topics; }

  constructor() {
    this.topicsCtrl.valueChanges.subscribe(value => {console.log(value)})
  }

  onToggle(topic: string, checked: boolean) {
    const curr = this.topicsCtrl.value;
    const next = checked ? [...curr, topic] : curr.filter(t => t !== topic);
    this.topicsCtrl.setValue(next);
  }

  isChecked(topic: string) {
    return this.topicsCtrl.value.includes(topic);
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    console.log('selected:', this.topicsCtrl.value);
  }
}
