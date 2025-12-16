import { Component, inject, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

// interface UserForm {
//   userName: FormControl<string>
//   userEmail: FormControl<string | null>
//   userPassword: UserPassword
//   userPhones: FormControl<string>[]
// }

// interface UserPassword {
//   password: FormControl<string | null>
//   confirmPassword: FormControl<string | null>
// }

@Component({
  selector: 'app-reactive-form',
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-form.html',
  styleUrl: './reactive-form.scss',
  // encapsulation: ViewEncapsulation.None
})
export class ReactiveForm {
  // userForm: FormGroup = new FormGroup({
  //   userName: new FormControl("Goga", { validators: [ Validators.required ] , nonNullable: true }),
  //   userEmail: new FormControl("",[ Validators.required, Validators.email ]),
  //   userPassword: new FormGroup({
  //     password: new FormControl(),
  //     confirmPassword: new FormControl(),
  //   })
  // });

  private noSpaces: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value
    return value.includes(" ") ? {noSpaces: true} : null
  }

  private matchPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get("password")?.value
    const confirmPassword = group.get("confirmPassword")?.value
    return password === confirmPassword ? null : {matchPassword: true}
  }

  private minPhones = (min: number): ValidatorFn => (array: AbstractControl): ValidationErrors | null => { // я не понял, как оно работает, оно - ЗАМЫКАНИЕ
    const formArray = array as FormArray
    return formArray.length >= min ? null : {minPhones: true}
  }

//   makeMinItemsValidator(min: number) {
//   // внешняя функция от min
//   return function validator(fa: FormArray): { minItems: true } | null {
//     // внутренняя функция-валидатор
//     // здесь мы используем min, хотя min не параметр validator
//     return fa.length >= min ? null : { minItems: true };
//   };
// }

  fb = inject(FormBuilder);
  userForm = this.fb.group({
    userName: this.fb.nonNullable.control<string>("", [Validators.required, this.noSpaces]), 
    userEmail: this.fb.control("", [ Validators.required, Validators.email ]),
    userPassword: this.fb.group(
      {
        password: this.fb.control("1234"),
        confirmPassword: this.fb.control(""),
      },
      {validators: this.matchPasswords}
    ),
    userPhones: this.fb.array(
      [this.phoneControl()], 
      this.minPhones(1)
    )
  })
  
  phoneControl(): FormControl {
    return this.fb.control("", Validators.required)
  }

  removePhone(index: number) {
    this.userForm.controls.userPhones.removeAt(index)
  }

  removeAllPhones() {
    this.userForm.controls.userPhones.clear()
  }

  addPhone() {
    this.userForm.controls.userPhones.push(this.phoneControl())
  }

  onSubmit() {
    console.log(this.userForm);
    console.log(this.userForm.value);
    // console.log(this.userForm.getRawValue());
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      console.log("ты чо твариш");
      return
    };
    this.userForm.reset();
    console.log(this.userForm.get("userName")?.value)
    // this.userForm.setValue({
    //   userName: "Semen",
    //   userEmail: "a@a.a",
    //   userPassword: {
    //     password: "",
    //     confirmPassword: ""
    //   },
    //   userPhones: ["88005553535", "214"]
    // })
    this.userForm.patchValue({
      userName: "Semeniy"      
    })
  }
}
