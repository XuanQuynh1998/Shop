export function phoneValidation(phone) {
    return phone.match("^[0-9]*$") && phone.length >= 10;
}

export function fullNameValidation(fullName) {
    return fullName.match(/^[A-Za-z\s]+$/);
}
