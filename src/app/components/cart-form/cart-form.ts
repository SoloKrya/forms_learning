import { Component, inject } from '@angular/core';
import {
    AbstractControl,
    ControlConfig,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { timestamp } from 'rxjs';

type ShippingMethod = 'courier' | 'pickup' | null;

//я въебал это, чтобы работало заполнение демо
interface Cart {
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    items: {
        [key: string]: any;
    }[];
    shipping: {
        method: ShippingMethod | null;
        address: {
            city: string | null;
            street: string | null;
            zip: string | null;
        };
        pickupPoint: string | null;
        date: string | null;
    };
    payment: {
        cardNumber: string | null;
        cardHolder: string | null;
        expiry: string | null;
        cvv: string | null;
    };
    promo: string | null;
    agree: boolean | null;
}

@Component({
    selector: 'app-cart-form',
    imports: [ReactiveFormsModule],
    templateUrl: './cart-form.html',
    styleUrl: './cart-form.scss',
})
export class CartForm {
    private noDigits: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        // const trimmedValue = control.value.trim(); я не стал это тримить, потому что на валидность пробелы не влияют
        let isNameGood = true;
        for (const symbol of control.value) {
            if (symbol >= '0' && symbol <= '9') {
                isNameGood = false;
                break;
            }
        }
        return isNameGood ? null : { noDigits: true };
    };

    private noTempDomen: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        let badMail = ['@tempmail.com', '@mailinator.com', '@guerrillamail.com'];

        // сначала я написал это, потом посмотрел предложенное
        // let goodMail = 1;
        // for (const mail of badMail) {
        //   if (control.value.toLowerCase().includes(mail)) {goodMail = 0};
        // }
        // return goodMail === 1? null : {noTempDomen: true};

        return badMail.includes(
            control.value.slice(control.value.lastIndexOf('@')).toLowerCase().trim(),
        )
            ? { noTempDomen: true }
            : null; //не ввел переменную, потому что не придумал, как назвать. зачем тут трим я снова не понимаю, типа по приколу от пробелов на концах?
    };

    private phoneLike: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        let validSymbols = ['+', '-', '(', ')', ' '];
        let isPhoneGood = true;
        let phoneLength = control.value.split(' ').join('').length; //тут ввел переменную, потому что считаю ее неочевидной
        for (const symbol of control.value) {
            if (isNaN(Number(symbol)) && !validSymbols.includes(symbol)) {
                isPhoneGood = false;
                break;
            }
        }
        return control.value === '' || (isPhoneGood && phoneLength > 6)
            ? null
            : { phoneLike: true };
    };

    private positiveNumber: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        return control.value >= 0 ? null : { positiveNumber: true }; //пачиму цена может быть нулевой...
    };

    private naturalNumber: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        return control.value === null ||
            (control.value >= 1 && Number.isInteger(Number(control.value)))
            ? null
            : { naturalNumber: true };
    };

    private uniqueSkus: ValidatorFn = (array: AbstractControl): ValidationErrors | null => {
        const formArray = array as FormArray;
        let skuArray: string[] = [];
        let isSkuUnique = true;
        for (const item of formArray.controls) {
            if (skuArray.includes(item.value.sku.trim().toLowerCase()) && item.value.sku !== null) {
                isSkuUnique = false;
                break;
            }
            skuArray.push(item.value.sku.trim().toLowerCase());
        }
        return isSkuUnique ? null : { uniqueSkus: true };
    };

    private minItems =
        (min: number): ValidatorFn =>
        (array: AbstractControl): ValidationErrors | null => {
            const itemsArray = array as FormArray;
            return itemsArray.length < min ? { minItems: true } : null;
        };

    private maxTotal =
        (max: number): ValidatorFn =>
        (array: AbstractControl): ValidationErrors | null => {
            const formArray = array as FormArray;
            //сначала я это сделал, потом с ретурном разбирался
            // for (const item of formArray.controls) {
            //   total += Number(item.value.price) * Number(item.value.qty)
            // }
            return formArray.value.reduce(
                (sum: number, item: { price: number; qty: number }) => sum + item.price * item.qty,
                0,
            ) > max
                ? { maxTotal: true }
                : null;
        };

    private zipFormat: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        // let zipWithNoSpaces = control.value.split(' ').join('');
        let isZipFormatGood = true;
        let defisCount = 0;
        let i = 0;
        let zipLength = control.value.length;
        for (const symbol of control.value) {
            if (symbol === '-') {
                defisCount += 1;
                if (defisCount > 1 || i === 0 || i === zipLength - 1) {
                    isZipFormatGood = false;
                    break;
                }
            } else if (isNaN(Number(symbol))) {
                isZipFormatGood = false;
                break;
            }
            i += 1;
        }
        return control.value === '' || (isZipFormatGood && zipLength > 4 && zipLength < 11)
            ? null
            : { zipFormat: true };
    };

    //не работает
    private dateFormat: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const date = new Date(control.value);
        return control.value !== '' && date.toString() === 'Invalid Date'
            ? { dateFormat: true }
            : null;
    };

    //не работает
    private dateWithin =
        (minDays: number, maxDays: number): ValidatorFn =>
        (control: AbstractControl): ValidationErrors | null => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const shippingDate = new Date(control.value + 'T00:00:00');
            const min = new Date(today);
            const max = new Date(today);
            min.setDate(min.getDate() + minDays);
            max.setDate(max.getDate() + maxDays);
            return !isNaN(shippingDate.getTime()) && (shippingDate < min || shippingDate > max)
                ? { dateWithin: true }
                : null;
        };

    private notWeekend: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        return new Date(control.value).getDay() === 0 || new Date(control.value).getDay() === 6
            ? { notWeekend: true }
            : null;
    };

    fb = inject(FormBuilder);
    methods: ShippingMethod[] = ['courier', 'pickup'];
    savepoint!: Cart; //Я не понимаю, что тут написано, но оно работает
    private demoData = {
        customer: {
            name: 'Иван Иванов',
            email: 'email@mail.com',
            phone: '88005553535',
        },
        items: [
            {
                sku: '1234567890',
                title: 'Товар',
                price: '100',
                qty: 1,
            },
        ],
        shipping: { method: <ShippingMethod>'courier' }, //Я не понимаю, что тут написано, но оно работает
        payment: {
            cardNumber: '1234 1234 1234 1234',
            cardHolder: 'Ivan Ivanov',
            expiry: '01/01',
            cvv: '123',
        },
    };

    cartForm = this.fb.group({
        customer: this.fb.group({
            name: this.fb.nonNullable.control<string>('', [Validators.required, this.noDigits]),
            email: this.fb.nonNullable.control<string>('', [
                Validators.required,
                Validators.email,
                this.noTempDomen,
            ]),
            phone: this.fb.nonNullable.control<string>('', [Validators.required, this.phoneLike]),
        }),

        items: this.fb.array(
            [this.itemFormGroup()],
            [this.minItems(1), this.uniqueSkus, this.maxTotal(10000)],
        ),

        shipping: this.fb.group({
            method: this.fb.control<ShippingMethod>(null, Validators.required),
            address: this.fb.group({
                city: this.fb.control<string>(''),
                street: this.fb.control<string>(''),
                zip: this.fb.control<string>('', this.zipFormat),
            }),
            pickupPoint: this.fb.control<string>(''),
            date: this.fb.control<string>('', [
                Validators.required,
                this.dateFormat,
                this.dateWithin(3, 14),
                this.notWeekend,
            ]), //не понял, что за дата - решил, что и для доставки, и для саомвывоза актуальна, плюс навесил на нее обязательность, плюс добавил проверку на формат
        }),

        payment: this.fb.group({
            cardNumber: this.fb.control<string>(''),
            cardHolder: this.fb.control<string>(''),
            expiry: this.fb.control<string>(''),
            cvv: this.fb.control<string>(''),
        }),

        promo: this.fb.control<string>(''),
        agree: this.fb.control<boolean>(false),
    });

    // get shippingCtrl() { return this.cartForm.controls.shipping.controls.method; }//Я ничего не понимаю
    //Я ничего не понимаю
    constructor() {
        //Я ничего не понимаю
        this.cartForm.controls.shipping.controls.method.valueChanges.subscribe(); //Я ничего не понимаю
    } //Я ничего не понимаю

    itemFormGroup(): FormGroup {
        return this.fb.group({
            sku: this.fb.control<string>(''),
            title: this.fb.control<string>('', Validators.required),
            price: this.fb.control<number | null>(null, [Validators.required, this.positiveNumber]),
            qty: this.fb.control<number | null>(null, [Validators.required, this.naturalNumber]),
        });
    }

    addDemo() {
        this.cartForm.patchValue(this.demoData);
    }

    addItem() {
        this.cartForm.controls.items.push(this.itemFormGroup());
    }

    removeItem(index: number) {
        if (this.cartForm.controls.items.length > 1) {
            this.cartForm.controls.items.removeAt(index);
        }
    }

    removeAllItems() {
        this.cartForm.controls.items.clear();
        this.addItem();
    }

    saveCartValues() {
        this.savepoint = this.cartForm.getRawValue();
    }

    restoreCartValues() {
        this.cartForm.setValue(this.savepoint);
    }

    removeCartValues() {
        this.removeAllItems();
        this.cartForm.reset();
    }

    updateValidators() {
        //я все еще ничего не понимаю
        if (this.cartForm.controls.shipping.controls.method.value === 'courier') {
            this.cartForm.controls.shipping.controls.address.controls.city.setValidators([
                Validators.required,
            ]);
            this.cartForm.controls.shipping.controls.address.controls.street.setValidators([
                Validators.required,
            ]);
            this.cartForm.controls.shipping.controls.address.controls.zip.setValidators([
                Validators.required,
                this.zipFormat,
            ]);
            this.cartForm.controls.shipping.controls.pickupPoint.clearValidators();
            this.cartForm.controls.shipping.controls.address.controls.city.updateValueAndValidity({
                emitEvent: false,
            });
            this.cartForm.controls.shipping.controls.address.controls.street.updateValueAndValidity(
                {
                    emitEvent: false,
                },
            );
            this.cartForm.controls.shipping.controls.address.controls.zip.updateValueAndValidity({
                emitEvent: false,
            });
            this.cartForm.controls.shipping.controls.pickupPoint.updateValueAndValidity({
                emitEvent: false,
            });
        } else if (this.cartForm.controls.shipping.controls.method.value === 'pickup') {
            this.cartForm.controls.shipping.controls.address.controls.city.clearValidators();
            this.cartForm.controls.shipping.controls.address.controls.street.clearValidators();
            this.cartForm.controls.shipping.controls.address.controls.zip.clearValidators();
            this.cartForm.controls.shipping.controls.pickupPoint.setValidators([
                Validators.required,
            ]);
            this.cartForm.controls.shipping.controls.address.controls.city.updateValueAndValidity({
                emitEvent: false,
            });
            this.cartForm.controls.shipping.controls.address.controls.street.updateValueAndValidity(
                {
                    emitEvent: false,
                },
            );
            this.cartForm.controls.shipping.controls.address.controls.zip.updateValueAndValidity({
                emitEvent: false,
            });
            this.cartForm.controls.shipping.controls.pickupPoint.updateValueAndValidity({
                emitEvent: false,
            });
        }
    }

    onSubmit() {
        console.log(this.cartForm);
        console.log(
            this.cartForm.controls.items.value.reduce(
                (sum, item) => sum + Number(item.price) * Number(item.qty),
                0,
            ),
        );
        if (this.cartForm.valid === false) {
            this.cartForm.markAllAsTouched();
        }
    }
}
