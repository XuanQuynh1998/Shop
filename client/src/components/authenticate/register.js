import {login} from "./login.js";

export function register(username, password, retypePassword) {
    $.ajax({
        type: 'POST',
        url: '/buyer/register',
        data: {
            username: username,
            password: password,
            retypePassword: retypePassword,
        }
    }).done(res => {
        if (res.success === false) {
            const regFormIncorrect = document.querySelector('.auth-form__form-incorrect-register');
            regFormIncorrect.innerHTML =
                `<i class="fas fa-exclamation-triangle"></i> ${res.message}`;
            regFormIncorrect.classList.remove('run__warning-animation');
            void regFormIncorrect.offsetWidth;
            regFormIncorrect.classList.add('run__warning-animation');
        } else {
            login(username, password);
        }
    })
}