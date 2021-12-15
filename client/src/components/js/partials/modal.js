import { login } from "../../authenticate/login.js";
import { register } from "../../authenticate/register.js";

export function pageHandle(element, event) {
    const listModalAttr = ["switch-btn", "login-btn", "register-btn", "back-btn", "alert-popup"];

    let result;
    listModalAttr.some((attr) => {
        if (attr.match(element.getAttribute("modal-attr"))) {
            result = [attr, element];
            return true;
        }
    });

    const modal = document.querySelector(".modal");

    const resetInputModal = () => {
        const allInputs = modal.querySelectorAll("input");
        allInputs.forEach((input) => {
            input.value = "";
        });
        document.querySelector(".auth-form__form-incorrect-login").innerHTML = "";
        document.querySelector(".auth-form__form-incorrect-register").innerHTML = "";
    };

    const hiddenAllModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    switch (result[0]) {
        case "switch-btn": {
            event.preventDefault();
            resetInputModal();
            const loginForm = document.getElementById("auth-form-login");
            const registerForm = document.getElementById("auth-form-register");
            if (loginForm.style.display === "none") {
                registerForm.style.display = "none";
                loginForm.style.display = "block";
            } else {
                loginForm.style.display = "none";
                registerForm.style.display = "block";
            }
            break;
        }

        case "login-btn": {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            login(username, password);
            break;
        }

        case "register-btn": {
            event.preventDefault();
            const username = document.getElementById("res-username").value;
            const password = document.getElementById("res-password").value;
            const retypePassword = document.getElementById("res-retype-password").value;
            register(username, password, retypePassword);
            break;
        }

        case "back-btn": {
            event.preventDefault();
            resetInputModal();
            hiddenAllModal();
            break;
        }

        case "alert-popup": {
            hiddenAllModal();
            break;
        }
    }
}
