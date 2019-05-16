const luhnCheck = (function (arr) {
    return function (ccNum) {
        var 
            len = ccNum.length,
            bit = 1,
            sum = 0,
            val;

        while (len) {
            val = parseInt(ccNum.charAt(--len), 10);
            sum += (bit ^= 1) ? arr[val] : val;
        }

        return sum && sum % 10 === 0;
    };
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));

const cuitCheck = (function (multipliers) {
    return function(cuit) {
        if (cuit.length === 11) {
            const parts = cuit.split('').reverse();
            const verifier = parts[0];
            const numbers = parts.slice(1);
            const sum = numbers.reduce((acum, val, i) => acum + (val * multipliers[i]), 0);
            let result = sum % 11;
            result = 11 - result;
            if (result === 10) result = 9
            if (result === 11) result = 0
            return Number(verifier) === result;
        } else {
            return false;
        }
    }
})([ 2, 3, 4, 5, 6, 7, 2, 3, 4, 5 ])

const _appendValidation = (prev, current) => {
    if (!current.valid) {
        return {
            valid: false,
            messages: prev.messages.concat(current.messages)
        }
    }
    return prev;
}

const requiredValidator = (value) => {
    if (!value) {
        return {
            valid: false,
            messages: [ 'El campo es requerido' ]
        };
    }
    return { valid: true };
}

const lengthValidator = (value, length) => {
    if (!value || (length > 0 && value.toString().length !== length )) {
        return {
            valid: false,
            messages: [ `El campo debe tener ${length} caracteres` ]
        };
    }
    return { valid: true };
}

const numberValidator = (value) => {
    if (value && isNaN(value)) {
        return {
            valid: false,
            messages: [ 'El campo debe ser numérico' ]
        }
    }
    return { valid: true }
}

const binValidator = (value, bines) => {
    if (!value || isNaN(value) || !bines.some(bin => value.toString().startsWith(bin))) {
        return {
            valid: false,
            messages: ['Tarjeta no disponible para esta promoción']
        }
    }
    return { valid: true }
}

const ccValidator = (value) => {
    if (!value || !luhnCheck(value)) {
        return {
            valid: false,
            messages: ['Número de tarjeta inválido']
        }
    }
    return { valid: true }
}

const cuitValidator = (value) => {
    if (!value || !cuitCheck(value)) {
        return {
            valid: false,
            messages: ['Identificación fiscal inválida']
        }
    }
    return { valid: true }
}

module.exports.validator = (value, { type, length, required, bines, creditCard, cuit }) => {
    let obj = { valid: true, messages: [] };
    if (required) {
        obj = _appendValidation(obj, requiredValidator(value));
    }
    if (type) {
        switch(type) {
            case 'number':
                obj = _appendValidation(obj, numberValidator(value));
                break;
            default:
                break;
        }
    }
    if (length) {
        obj = _appendValidation(obj, lengthValidator(value, length));
    }
    if (bines && bines.length) {
        obj = _appendValidation(obj, binValidator(value, bines));
    }
    if (creditCard) {
        obj = _appendValidation(obj, ccValidator(value));
    }
    if (cuit) {
        obj = _appendValidation(obj, cuitValidator(value));
    }
    return obj;
}