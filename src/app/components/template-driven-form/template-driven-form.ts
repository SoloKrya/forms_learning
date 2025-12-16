import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-template-driven-form',
  imports: [FormsModule],
  templateUrl: './template-driven-form.html',
  styleUrl: './template-driven-form.scss'
})
export class TemplateDrivenForm {
  model = { name: '', email: '' };
  submitted = false;

  onNameChange(value:string) {
    console.log(value)
  }

  onSubmit(form: NgForm) {
    const emailControl = form.controls['emailControl'];
    console.log(emailControl.disable());
    console.log(form);
    if (form.valid) {
      console.log('Данные формы:', this.model);
      this.submitted = true;
      form.resetForm(); // сбрасывает значения и состояния touched/dirty
    }
  }
}
