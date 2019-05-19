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

const emailExpression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

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

const emailValidator = (value) => {
    if (!value  || !emailExpression.test(String(value).toLowerCase())) {
        return {
            valid: false,
            messages: [ 'El email es invalido' ]
        }
    }
    return { valid: true }
}
const emailComparisionValidator = (value,email) => {
    if (!(email === value)) {
        return {
            valid: false,
            messages: [ 'Debe coincidr' ]
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

module.exports.validator = (value, { type, length, required, bines, creditCard, cuit ,email}) => {
    let obj = { valid: true, messages: [] };
    if (required) {
        obj = _appendValidation(obj, requiredValidator(value));
    }
    if (type) {
        switch(type) {
            case 'number':
                obj = _appendValidation(obj, numberValidator(value));
                break;
            case 'email':
                obj = _appendValidation(obj, emailValidator(value));
                break;
            default:
                break;
        }
    }
    if(email){
        obj = _appendValidation(obj, emailComparisionValidator(value, email));
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