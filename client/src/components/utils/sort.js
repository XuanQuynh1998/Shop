export function sortProducts(button) {
    let href = location.href;
    if (location.search === "") {
        href = href + "?page=1";
    }
    if (button.innerText === "Phổ biến") {
        return href.split("&")[0] + "&sortBy=pop";
    }
    if (button.innerText === "Mới nhất") {
        return href.split("&")[0] + "&sortBy=time";
    }
    if (button.innerText === "Bán chạy") {
        return href.split("&")[0] + "&sortBy=sales";
    }
}

export function buttonSortLayout() {
    const sortQuery = location.search.split("&")[1];
    const sortPrice = location.search.split("&")[2];
    const buttonSortClicked = document.querySelectorAll(".home-filter__btn");
    const removeButtonLayout = () => {
        buttonSortClicked.forEach((element) => {
            element.classList.remove("btn--primary");
        });
    };
    removeButtonLayout();

    const sortTypeButton = [
        { type: "sortBy=sales", text: "Bán chạy" },
        { type: "sortBy=time", text: "Mới nhất" },
        { type: "sortBy=pop", text: "Phổ biến" },
    ];

    let sortList = { text: sortTypeButton[2].text };

    sortTypeButton.forEach((item) => {
        if (item.type === sortQuery) {
            sortList["text"] = item.text;
        }
    });

    buttonSortClicked.forEach((element) => {
        if (element.innerText === sortList.text) {
            element.classList.add("btn--primary");
        }
    });

    if (sortPrice !== undefined) {
        const inputItems = document.querySelectorAll(".select-input__item");
        if (sortPrice === "type=asc") {
            document.querySelector(".select-input__label").innerText = "Giá: Thấp đến cao";
            inputItems[0].classList.add("selected");
        }
        if (sortPrice === "type=desc") {
            document.querySelector(".select-input__label").innerText = "Giá: Cao đến thấp";
            inputItems[1].classList.add("selected");
        }
        document.querySelector(".select-input__label").style.color = "var(--primary-color)";
        removeButtonLayout();
    }
}

export function sortByPrice(element) {
    let typeSort;
    let href = location.href;

    if (element.innerText === "Giá: Thấp đến cao") typeSort = "asc";
    if (element.innerText === "Giá: Cao đến thấp") typeSort = "desc";
    if (location.search === "") {
        return href + `?page=1&sortBy=price&type=${typeSort}`;
    }
    if (href.split("&")[2] === undefined) {
        return href + "&type=desc";
    }
    return href.split("&")[0] + "&sortBy=price" + `&type=${typeSort}`;
}
