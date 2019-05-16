module.exports.keyGenerator = function(s) {
    var hash = 0, i = 0, len = s.length;
    while ( i < len ) {
        hash  = ((hash << 5) - hash + s.charCodeAt(i++)) << 0;
    }
    return hash;
};

module.exports.loadLuggage = function(weight) {
    try {
        return require(`assets/img/flights/luggage-${weight}.svg`)
    } catch (e) {
        console.log(`${weight} not found!`);
        return "false";
    }
}

module.exports.loadImage = function(code) {
    try {
        return require(`assets/img/payments/${code}.svg`);
    }
    catch (e) {
        console.log(`${code} image not found!`);
        return '';
    }
}
