import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
    public static notSmaller(firstField: string, secondField: string) {
        const validator = (group: AbstractControl): ValidationErrors | null => {
            const firstControl = group.get(firstField);
            const secondControl = group.get(secondField);
            if (firstControl === null) throw new Error(`${firstField} Field cannot be found.`);
            if (secondControl === null) throw new Error(`${secondField} Field cannot be found.`)
            if (firstControl.value < secondControl.value) {
                return { notSmaller: true };
            }
            return null;
        }
        return validator;
    }

    public static onlyDigits(field: AbstractControl): ValidationErrors | null {

        const value: string = field.value;
        "^[0-9]+$";
        const regex = /^[0-9]+$/;
        const regexTest = regex.test(value);
        if (regexTest) {
            return null;
        }
        return { onlyDigits: true };
    }
}