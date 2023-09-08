/**
 * Decimal to hexidecimal
 *
 * @param {number} dec
 * @returns {string}
 */
function dec2hex(dec) {
    return dec.toString(16).padStart(2, '0');
}

const usedIds = [];

/**
 * Generates a random ID.
 *
 * @param {Number} length
 * @return {string}
 */
function generateId(length = 32) {
    const arr = new Uint8Array(length / 2);
    let value = '';

    do {
        window.crypto.getRandomValues(arr);
        value = Array.from(arr, dec2hex).join('');
    } while (usedIds.includes(value));

    return value;
}

export {
    generateId,
    dec2hex,
};
