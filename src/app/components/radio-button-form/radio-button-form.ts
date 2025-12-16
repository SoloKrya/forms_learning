import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type PaymentMethod = 'card' | 'paypal' | 'cod'

@Component({
  selector: 'app-radio-button-form',
  imports: [ReactiveFormsModule],
  templateUrl: './radio-button-form.html',
  styleUrl: './radio-button-form.scss'
})
export class RadioButtonForm {
  private fb = inject(FormBuilder);

  methods: PaymentMethod[] = ['card', 'paypal', 'cod'];

  form = this.fb.nonNullable.group({
    payment: this.fb.nonNullable.control<PaymentMethod>('card', [Validators.required]),
  });

  get payment() { return this.form.controls.payment; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    console.log('method:', this.form.getRawValue().payment);
  }
}
