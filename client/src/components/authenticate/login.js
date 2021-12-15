export function login(username, password) {
    $.ajax({
        type: 'POST',
        url: '/buyer/login',
        data: {
            username: username,
            password: password,
        }
    }).done(res => {
        if (res.success === false) {
            const logInFormIncorrect = document.querySelector('.auth-form__form-incorrect-login');
            document.querySelector('.auth-form__form-incorrect-login').innerHTML =
                `<i class="fas fa-exclamation-triangle"></i> ${res.message}`;
            logInFormIncorrect.classList.remove('run__warning-animation');
            void logInFormIncorrect.offsetWidth;
            logInFormIncorrect.classList.add('run__warning-animation');
        }
        if (res.user) {
            window.location.reload();
        }
    })
}