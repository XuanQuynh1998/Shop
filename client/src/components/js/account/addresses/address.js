import * as addressHandle from "./addressHandle.js";

export function pageHandle(element, event) {
    const listAddressAttr = [
        "add-address",
        "back",
        "submit",
        "set-default",
        "select-province",
        "select-district",
        "select-ward",
        "select-location",
        "input",
        "edit-address",
        "remove-address",
    ];

    let result;
    listAddressAttr.some((attr) => {
        if (attr.match(element.getAttribute("address-attr"))) {
            result = [attr, element];
            return true;
        }
    });

    switch (result[0]) {
        case "set-default": {
            event.preventDefault();
            const addressId = result[1].closest(".account-address").querySelector('input[type="hidden"]').value;
            addressHandle.setDefaultAddress(addressId);
            break;
        }

        case "add-address": {
            event.preventDefault();
            addressHandle.changeAddressForm("show");

            break;
        }

        case "input": {
            addressHandle.changeIncorrectFormWarning();
            addressHandle.changePlaceholderPosition("up", result[1]);
            break;
        }

        case "select-province": {
            addressHandle.createSelectListLocation("province");
            break;
        }

        case "select-district": {
            addressHandle.createSelectListLocation("district");
            break;
        }

        case "select-ward": {
            addressHandle.createSelectListLocation("ward");
            break;
        }

        case "select-location": {
            addressHandle.selectLocation(result[1]);
            break;
        }

        case "back": {
            event.preventDefault();
            addressHandle.changeAddressForm();
            break;
        }

        case "submit": {
            event.preventDefault();
            if (addressHandle.checkInput()) {
                const inputs = document.querySelectorAll(".account-address-new-address__main-item--input");

                const fullName = inputs[0].value;
                const phone = inputs[1].value;
                const buildingStreet = inputs[2].value;
                const listLocation = addressHandle.getCurrentAddress();
                let setDefault = document.querySelector('input[id="address-checkbox"]:checked');
                setDefault ? (setDefault = true) : (setDefault = false);

                const address = [buildingStreet, listLocation[2], listLocation[1], listLocation[0]];

                const newAddressInfo = {
                    fullName,
                    phone,
                    address: JSON.stringify(address),
                    setDefault,
                };

                const formData = new FormData();

                for (let key in newAddressInfo) {
                    formData.append(key, newAddressInfo[key]);
                }
                addressHandle.setLocation(formData).then((response) => {
                    if (response.success) {
                        addressHandle.changeAddressForm();
                        addressHandle.reRenderAddressView();
                    }
                });
            }
            break;
        }

        case "edit-address": {
            event.preventDefault();
            const addressId = result[1]
                .closest(".account-address__buttons")
                .querySelector('input[type="hidden"]').value;
            const addressWrap = result[1].closest(".account-address");
            addressHandle.editAddress(addressWrap, addressId);
            break;
        }

        case "remove-address": {
            event.preventDefault();
            const addressId = result[1]
                .closest(".account-address__buttons")
                .querySelector('input[type="hidden"]').value;
            addressHandle.removeAddress(addressId).then((response) => {
                if (response) {
                    addressHandle.reRenderAddressView();
                }
            });

            break;
        }
    }

    document.addEventListener("click", (e) => {
        addressHandle.closeSelectListLocation();
    });
}
