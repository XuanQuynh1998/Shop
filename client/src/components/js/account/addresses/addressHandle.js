import { phoneValidation, fullNameValidation } from "../../others/inputValidation.js";

const defaultProvinceText = "Tỉnh/Thành phố";
const defaultDistrictText = "Quận/Huyện";
const defaultWardText = "Phường/Xã";
const addNewAddressText = "Địa Chỉ Mới";
const editAddressText = "Chỉnh Sửa Địa Chỉ";

const createSelectLocation = (locationData) => {
    let locatonSelectHtml = "";
    locationData.sort();
    locationData.forEach((location) => {
        locatonSelectHtml += `<li class="new-address-item" address-attr="select-location">${location}</li>`;
    });

    return `
    <ul class="account-address-new-address__main-item--list-select">
        ${locatonSelectHtml}
    </ul>`;
};

export function closeSelectListLocation() {
    const listSelectLocation = document.querySelector(".account-address-new-address__main-item--list-select");

    if (listSelectLocation) {
        listSelectLocation.remove();
        return true;
    }
}

const resetCurrentLocation = (locationElement) => {
    const currentDistrict = document.querySelector(".account-address-district");
    const currentWard = document.querySelector(".account-address-ward");

    if (locationElement.classList.contains("account-address-province")) {
        currentDistrict.innerText = defaultDistrictText;
        currentDistrict.style.color = "rgba(0, 0, 0, 0.4)";
        currentWard.innerText = defaultWardText;
        currentWard.style.color = "rgba(0, 0, 0, 0.4)";
    }

    if (locationElement.classList.contains("account-address-district")) {
        currentWard.innerText = defaultWardText;
        currentWard.style.color = "rgba(0, 0, 0, 0.4)";
    }
};

export function changeIncorrectFormWarning(action = "hide", message = null) {
    const incorrectForm = document.querySelector(".account-address-new-address__incorrect-form");
    const incorrectFormText = document.querySelector(".account-address-new-address__incorrect-text");

    if (action === "show") {
        if (message) {
            incorrectFormText.innerText = message;
        }
        incorrectForm.style.display = "flex";
        return;
    }
    incorrectForm.style.display = "none";
}

export async function getAddresses() {
    const addresses = await $.ajax({
        url: "/user_info/addresses/get_addresses",
    });

    return addresses;
}

export async function setDefaultAddress(addressId) {
    const response = await $.ajax({
        type: "POST",
        url: "/user_info/addresses/set_default",
        data: { addressId: addressId },
    });

    if (response.success) {
        const addressBtnWrap = document
            .querySelector('input[value="' + addressId + '"]')
            .closest(".account-address__buttons");
        const setDefaultAddressBtn = addressBtnWrap.querySelector(".address__buttons--set-default");
        const currentDefautBtn = document.querySelector(".btn--disabled");
        const defaultBadge = document.querySelector(".account-address__filed-default-badge");
        const badgeContainer = setDefaultAddressBtn
            .closest(".account-address")
            .querySelector(".account-address__filed-container");
        const removeAddressBtn = addressBtnWrap.querySelector('[address-attr="remove-address"]');
        const currentModifierBtnWrap = currentDefautBtn.parentNode.firstElementChild;

        currentDefautBtn.removeAttribute("disabled");
        currentDefautBtn.classList.remove("btn--disabled");
        currentModifierBtnWrap.insertAdjacentElement("beforeend", removeAddressBtn);

        setDefaultAddressBtn.setAttribute("disabled", "");
        setDefaultAddressBtn.classList.add("btn--disabled");
        badgeContainer.insertAdjacentElement("beforeend", defaultBadge);
    }
}

export async function createSelectListLocation(locationType) {
    let listLocation = [];

    if (closeSelectListLocation()) {
        return;
    }
    changeIncorrectFormWarning();
    switch (locationType) {
        case "province": {
            listLocation = await $.ajax({
                url: "/user_info/addresses/get_location/" + locationType,
            });
            break;
        }

        case "district": {
            const currentProvince = document.querySelector(".account-address-province").innerText;
            if (currentProvince !== defaultProvinceText) {
                listLocation = await $.ajax({
                    url: `/user_info/addresses/get_location/${locationType}?province=${currentProvince}`,
                });
            }
            break;
        }

        case "ward": {
            const currentProvince = document.querySelector(".account-address-province").innerText;
            const currentDistrict = document.querySelector(".account-address-district").innerText;
            if (currentProvince !== defaultProvinceText && currentDistrict !== defaultDistrictText) {
                listLocation = await $.ajax({
                    url: `/user_info/addresses/get_location/${locationType}?province=${currentProvince}&district=${currentDistrict}`,
                });
            }
            break;
        }
    }

    if (listLocation.length) {
        const selectLocationElement = document.querySelector('[address-attr="select-' + locationType + '"]');
        const listLocationHtml = createSelectLocation(listLocation);

        selectLocationElement.insertAdjacentHTML("beforeend", listLocationHtml);
    }
}

export function selectLocation(currentLocationElement) {
    const locationElementWrap = currentLocationElement.closest(".account-address-new-address__main-item");
    const locationElementText = locationElementWrap.querySelector(
        ".account-address-new-address__main-item--description"
    );

    locationElementText.innerText = currentLocationElement.innerText;
    locationElementText.style.color = "#222";

    resetCurrentLocation(locationElementText);
    closeSelectListLocation();
}

export async function setLocation(locationData) {
    const headerTitleText = document.querySelector(".account-address-new-address__header-title").innerText;
    const postLocation = async (url) => {
        const response = await $.ajax({
            url: url,
            type: "POST",
            data: locationData,
            contentType: false,
            processData: false,
        });

        return response;
    };

    const addNewAddressUrl = "/user_info/addresses/set_location";
    const editAddressUrl = "/user_info/addresses/edit_location";
    if (headerTitleText === addNewAddressText) {
        const response = await postLocation(addNewAddressUrl);

        return response;
    }

    if (headerTitleText === editAddressText) {
        const addressForm = document.querySelector(".account-address-new-address");
        const addressId = addressForm.querySelector("input[type='hidden']").value;

        locationData.append("addressId", addressId);
        const response = await postLocation(editAddressUrl);

        return response;
    }
}

export function getCurrentAddress() {
    const locationElements = document.querySelectorAll(".account-address-new-address__main-item--description");
    const listAddress = [...locationElements].map((locationElement) => {
        return locationElement.innerText;
    });

    return listAddress;
}

export function checkInput() {
    const selectLocations = document.querySelectorAll(".account-address-new-address__main-item--description");
    const allInput = document.querySelectorAll(".account-address-new-address__main-item--input");
    const fullName = allInput[0];
    const phoneInput = allInput[1];
    const listDefaulText = [defaultProvinceText, defaultDistrictText, defaultWardText];

    allInput.forEach((input) => {
        if (!input.value) {
            changeIncorrectFormWarning("show");
            return;
        }
    });

    if (!phoneValidation(phoneInput.value)) {
        changeIncorrectFormWarning("show", "Số điện thoại không hợp lệ");
        return;
    }

    if (!fullNameValidation(fullName.value)) {
        changeIncorrectFormWarning("show", "Họ và tên không hợp lệ");
        return;
    }

    selectLocations.forEach((select) => {
        if (listDefaulText.includes(select.innerText)) {
            changeIncorrectFormWarning("show");
            return;
        }
    });

    return true;
}

export function changePlaceholderPosition(type = "default", inputElement) {
    if (type === "up") {
        const inputDescription = inputElement.parentNode.querySelector(
            ".account-address-new-address__main-item--input-description"
        );
        inputDescription.style.transform = "translateY(-18px)";
        inputDescription.style.color = "var(--primary-color)";
        inputDescription.style.fontSize = "1.2rem";
        inputDescription.style.transition = "transform 0.2s ease";
        return;
    }
    const allinputDescriptions = document.querySelectorAll(
        ".account-address-new-address__main-item--input-description"
    );
    allinputDescriptions.forEach((input) => {
        input.style.transform = "translateY(0)";
        input.style.color = "rgba(0, 0, 0, 0.4)";
        input.style.fontSize = "1.4rem";
    });
}

export function resetInputForm() {
    const setDefaultCheckbox = document.querySelector("#address-checkbox");
    const listDefaulText = [defaultProvinceText, defaultDistrictText, defaultWardText];
    const allSelectField = document.querySelectorAll(".account-address-new-address__main-item--description");
    const allInput = document.querySelectorAll(".account-address-new-address__main-item--input");

    allInput.forEach((input) => {
        input.value = "";
    });

    for (let i = 0; i < allSelectField.length; i++) {
        allSelectField[i].innerText = listDefaulText[i];
        allSelectField[i].style.color = "rgba(0, 0, 0, 0.4)";
    }
    setDefaultCheckbox.checked = false;
}

export function changeAddressForm(action = "hide") {
    const addAddressModal = document.querySelector(".account-address-new-address__overlay");
    const headerTitle = document.querySelector(".account-address-new-address__header-title");

    if (action === "show") {
        addAddressModal.style.display = "flex";
        document.body.style.overflow = "hidden";
        return;
    }
    resetInputForm();
    changePlaceholderPosition();
    headerTitle.innerText = addNewAddressText;
    document.body.style.overflow = "auto";
    addAddressModal.style.display = "none";
}

export async function editAddress(element, id) {
    changeAddressForm("show");

    const allInput = document.querySelectorAll(".account-address-new-address__main-item--input");
    const allSelectField = document.querySelectorAll(".account-address-new-address__main-item--description");
    const setDefaultCheckbox = document.querySelector("#address-checkbox");
    const setDefaultText = document.querySelector(".account-address-new-address__set-default-text");
    const headerTitle = document.querySelector(".account-address-new-address__header-title");
    const addressForm = document.querySelector(".account-address-new-address");

    headerTitle.innerText = editAddressText;

    allInput.forEach((input) => {
        changePlaceholderPosition("up", input);
    });

    const fullName = element.querySelector(".account-address__filed-name").innerText;
    const phone = element.querySelector(".account-address__phone").innerText;
    const addressInnerHTML = element.querySelector(".account-address__address").innerHTML;

    const setDefault = element.querySelector(".account-address__filed-default-badge");
    const address = addressInnerHTML.split("<br>");

    allInput[0].value = fullName;
    allInput[1].value = phone;
    allInput[2].value = address[0].trim();

    for (let i = 0; i < allSelectField.length; i++) {
        allSelectField[i].innerText = address[address.length - 1 - i].trim();
        allSelectField[i].style.color = "#222";
    }

    if (setDefault) {
        setDefaultCheckbox.checked = true;
        setDefaultCheckbox.disabled = true;
        setDefaultText.style.color = "#e2e2e2";
    } else {
        setDefaultCheckbox.disabled = false;
        setDefaultText.style.color = "initial";
    }

    const addressId = addressForm.querySelector("input[type='hidden']");

    if (addressId) {
        addressId.remove();
    }
    const newAddressId = document.createElement("input");
    newAddressId.setAttribute("type", "hidden");
    newAddressId.setAttribute("value", id);
    addressForm.appendChild(newAddressId);
}

export async function reRenderAddressView() {
    const addressData = await $.ajax({
        url: "/user_info/addresses/get_addresses",
    });

    const addressBody = document.querySelector(".address-body");
    const reRenderAddressHtml = Handlebars.templates["addressesItem"](addressData);

    addressBody.innerHTML = reRenderAddressHtml;
}

export async function removeAddress(id) {
    const removeResponse = await $.ajax({
        url: `/user_info/addresses/remove_location/${id}`,
    });

    return removeResponse;
}
