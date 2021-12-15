import { selectDateHtml } from "../../others/htmlTemplates.js";
import { uploadUserInfo } from "./profileHandle.js";

export function pageHandle(element, event) {
    const listProfileAttr = ["select-day", "select-month", "select-year", "date", "submit", "select-avatar"];

    let result;
    listProfileAttr.some((attr) => {
        if (attr.match(element.getAttribute("profile-attr"))) {
            result = [attr, element];
            return true;
        }
    });

    const closeSelectList = (listSelect) => {
        listSelect.remove();
    };

    const changeDropIcon = (selectElement) => {
        const iconElement = selectElement.querySelector(".account-section-profile__left-item-content-birthday-icon");
        const listSelect = selectElement.querySelector(
            ".account-section-profile__left-item-content-birthday-select-wrap"
        );

        const upIconClass = "fa-chevron-up";
        const downIconClass = "fa-chevron-down";

        const currentUpIcon = document.querySelector(".fa-chevron-up");
        if (currentUpIcon) {
            currentUpIcon.classList.remove(upIconClass);
            currentUpIcon.classList.add(downIconClass);
        }

        if (listSelect) {
            iconElement.classList.remove(downIconClass);
            iconElement.classList.add(upIconClass);
        }
    };

    const createSelectDate = (dateElement, dateType) => {
        const listSelect = document.querySelector(".account-section-profile__left-item-content-birthday-select-wrap");
        if (listSelect) {
            if (listSelect.parentNode === dateElement) {
                closeSelectList(listSelect);
                return;
            }
            closeSelectList(listSelect);
        }
        const currentDate = dateElement.closest(".account-section-profile__left-item-content-birthday").innerText;
        const selectDate = selectDateHtml(currentDate, dateType);

        dateElement.insertAdjacentHTML("beforeend", selectDate);
    };

    const getDate = () => {
        const dateNodeList = document.querySelectorAll(".account-section-profile__left-item-content-birthday--input");
        return [...dateNodeList].map((dateElement) => {
            return dateElement.innerText;
        });
    };

    const changeStateSubmitBtn = (state = "enabled") => {
        const submitBtn = document.querySelector(".account-section-profile__submit-btn");
        if (state === "disabled") {
            submitBtn.setAttribute("disabled", "disabled");
            submitBtn.classList.add("btn--disabled");
            return;
        }
        submitBtn.removeAttribute("disabled");
        submitBtn.classList.remove("btn--disabled");
    };

    const checkDate = (Date) => {
        const day = +Date[0];
        const month = +Date[1].split(" ")[1];
        const year = +Date[2];

        const invalidHtml = document.querySelector(".account-section-profile__invalid-date");

        const listOfMonthsHas30Day = [4, 6, 9, 11];

        const isLeapYear = (year) => {
            if ((year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0)) {
                return true;
            }
            return false;
        };

        invalidHtml.style.display = "none";

        let state = "";

        if (listOfMonthsHas30Day.includes(month)) {
            if (day > 30) {
                invalidHtml.style.display = "block";
                state = "disabled";
            }
        }

        if (month === 2) {
            if (day > 29) {
                invalidHtml.style.display = "block";
                state = "disabled";
            } else {
                if (!isLeapYear(year)) {
                    if (day > 28) {
                        invalidHtml.style.display = "block";
                        state = "disabled";
                    }
                }
            }
        }

        if (state === "disabled") {
            changeStateSubmitBtn(state);
            return;
        }

        changeStateSubmitBtn();
    };

    switch (result[0]) {
        case "select-day": {
            event.preventDefault();
            event.stopPropagation();
            createSelectDate(result[1], "day");
            changeDropIcon(result[1]);
            break;
        }

        case "select-month": {
            event.preventDefault();
            event.stopPropagation();
            createSelectDate(result[1], "month");
            changeDropIcon(result[1]);
            break;
        }

        case "select-year": {
            event.preventDefault();
            event.stopPropagation();
            createSelectDate(result[1], "year");
            changeDropIcon(result[1]);
            break;
        }

        case "date": {
            const currentDateWrap = result[1].closest(".account-section-profile__left-item-content-birthday");

            const currentDate = currentDateWrap.querySelector(
                ".account-section-profile__left-item-content-birthday--input"
            );
            const listSelect = document.querySelector(
                ".account-section-profile__left-item-content-birthday-select-wrap"
            );

            currentDate.innerText = result[1].innerText;
            closeSelectList(listSelect);
            changeDropIcon(currentDateWrap);
            break;
        }

        case "select-avatar": {
            const inputAvatar = document.querySelector('input[type="file"]');
            const avatarImage = document.querySelector(".avatar-uploader__avatar-image");

            inputAvatar.onchange = function () {
                let url = URL.createObjectURL(this.files[0]);
                avatarImage.style.background = "url(" + url + ")";
            };
            break;
        }

        case "submit": {
            event.preventDefault();
            const getBirthday = () => {
                const birthDayNodeList = document.querySelectorAll(
                    ".account-section-profile__left-item-content-birthday--input"
                );
                const day = birthDayNodeList[0].innerText;
                const month = birthDayNodeList[1].innerText.split(" ")[1];
                const year = birthDayNodeList[2].innerText;

                return [day, month, year].join("/");
            };

            const getGender = () => {
                const genderCheckedRadio = document.querySelector('input[type="radio"]:checked');
                if (genderCheckedRadio) {
                    return genderCheckedRadio.value;
                }
                return "";
            };

            const changeDisplayAvatar = (avatarSrc) => {
                const headerAvatar = document.querySelector(".header-nav-user-img");
                const briefAvatar = document.querySelector(".user-page-brief-avatar");

                [headerAvatar, briefAvatar].forEach((elementAvatar) => {
                    elementAvatar.src = avatarSrc;
                });
            };

            const listInput = document.querySelectorAll(".account-section-profile__left-item-content--input");

            const avatar = document.querySelector("#avatar").files[0];
            const name = listInput[0].value;
            const phone = listInput[1].value;
            const gender = getGender();
            const birthday = getBirthday();

            const userInfo = {
                name,
                phone,
                gender,
                birthday,
            };

            let formData = new FormData();

            if (avatar) {
                formData.append("avatar", avatar);
            }

            for (let key in userInfo) {
                formData.append(key, userInfo[key]);
            }

            uploadUserInfo(formData).then((uploadResult) => {
                if (uploadResult.avatarUrl) {
                    const avatarUrl = uploadResult.avatarUrl;
                    changeDisplayAvatar(avatarUrl);
                }
            });

            break;
        }
    }

    const listSelectDate = document.querySelector(".account-section-profile__left-item-content-birthday-select-wrap");

    if (listSelectDate) {
        const elementSelect = listSelectDate.closest(".account-section-profile__left-item-content-birthday");
        document.addEventListener("click", (e) => {
            closeSelectList(listSelectDate);
            changeDropIcon(elementSelect);
        });
    }

    if (!listSelectDate) {
        checkDate(getDate());
    }
}
