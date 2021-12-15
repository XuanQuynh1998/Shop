export function keyPressed(key) {
    if (key === "Enter") {
        const searchInput = document.querySelector(".header__search-input");
        if (searchInput === document.activeElement && searchInput.value) {
            document.querySelector(".header__search-btn").click();
        }
        const modal = document.querySelector(".modal");
        const authFormLogin = document.querySelector("#auth-form-login");
        const authFormRegister = document.querySelector("#auth-form-register");
        if (modal.style.display === "flex") {
            if (authFormLogin.style.display === "block") {
                document.querySelector('button[modal-attr="login-btn"]').click();
            }
            if (authFormRegister.style.display === "block") {
                document.querySelector('[modal-attr="register-btn"]').click();
            }
        }
    }

    if (key === "Tab") {
        const addAddressFormOverlay = document.querySelector(
            ".account-address-new-address__overlay"
        );
        if (addAddressFormOverlay) {
            if (!addAddressFormOverlay.style.display === "flex") {
                return false;
            }
        }
    }
}
