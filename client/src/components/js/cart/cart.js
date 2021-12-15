import { updateCartProducts } from "../product/cartProducts.js";
import { removeCartItem, reRenderCartItems } from "./cartHandle.js";

export async function pageHandle(element, event) {
    const listCartAttr = [
        "buy-product",
        "select",
        "select-all",
        "adjust-product",
        "input-product",
        "remove-product",
        "buy-now",
        "item-link",
    ];
    let result;

    listCartAttr.some((attr) => {
        if (attr.match(element.getAttribute("cart-attr"))) {
            result = [attr, element];
            return true;
        }
    });

    const productCheckbox = document.querySelectorAll('input[cart-attr="select"]');
    const allCheckbox = document.querySelectorAll("input[cart-attr]");
    const selectAllCheckbox = document.querySelectorAll('input[cart-attr="select-all"]');
    const modal = document.querySelector(".modal");

    const checkAllCheckbox = () => {
        allCheckbox.forEach((checkbox) => {
            checkbox.checked = result[1].checked;
        });
    };

    const removeAllCheckbox = () => {
        selectAllCheckbox.forEach((checkbox) => {
            checkbox.checked = false;
        });
    };

    const isCheckboxChecked = () => {
        for (let i = 0; i < allCheckbox.length; i++) {
            if (allCheckbox[i].checked) {
                return true;
            }
        }
        return false;
    };

    const showAlertPopup = (message) => {
        const alertPopup = document.querySelector(".alert-popup");
        if (alertPopup) {
            alertPopup.remove();
        }

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";

        const modalBody = modal.querySelector(".modal__body");

        const alertContainer = document.createElement("div");
        alertContainer.classList.add("alert-popup");

        const alertText = document.createElement("div");
        alertText.classList.add("alert-popup__message");
        alertText.innerText = message;

        const confirmBtn = document.createElement("button");
        confirmBtn.className = "alert-popup__message-btn btn btn--primary";
        confirmBtn.innerText = "OK";
        confirmBtn.setAttribute("modal-attr", "alert-popup");

        alertContainer.appendChild(alertText);
        alertContainer.appendChild(confirmBtn);

        modalBody.appendChild(alertContainer);
    };

    const showTotalPrice = async () => {
        const allCheckedProducts = document.querySelectorAll('input[cart-attr="select"]:checked');
        const cartInfo = [...allCheckedProducts].map((checkedProduct) => {
            const productId = checkedProduct.closest(".cart-item").querySelector(".product-id").value;
            const quantity = checkedProduct.closest(".cart-item").querySelector(".item__quantity-input-number").value;
            return [productId, quantity];
        });

        const response = await updateCartProducts(cartInfo, "select");

        const allPrice = response.allPrice;
        const selectedProductsLabel = document.querySelectorAll(".cart-product-footer__selected-products");
        const totalPrice = document.querySelector(".cart-product-footer__total-price");

        selectedProductsLabel.forEach(
            (selectedProductsLabel) => (selectedProductsLabel.innerText = allCheckedProducts.length)
        );

        totalPrice.innerText = `${allPrice.toLocaleString()}đ`;
    };

    const updateCart = async (productId, currentProduct) => {
        let inputQuantity = currentProduct
            .closest(".cart-item__quantity")
            .querySelector(".item__quantity-input-number");
        const res = await updateCartProducts([[productId, inputQuantity.value]], "adjust");
        if (!res.success) {
            showAlertPopup(`Bạn chỉ có thể mua ${res.remain} sản phẩm này.`);
            inputQuantity.value = res.remain;
        } else {
            const currentItemPrice = currentProduct.closest(".cart-item").querySelector(".cart-item__total-price");
            currentItemPrice.innerText = `${res.currentItemPrice.toLocaleString()}đ`;
        }
    };

    switch (result[0]) {
        case "select-all": {
            checkAllCheckbox();
            showTotalPrice().then();
            break;
        }

        case "select": {
            const isCheckedAll = () => {
                for (let i = 0; i < productCheckbox.length; i++) {
                    if (!productCheckbox[i].checked) {
                        return false;
                    }
                }
                return true;
            };

            isCheckedAll() ? checkAllCheckbox() : removeAllCheckbox();
            showTotalPrice().then();
            break;
        }

        case "adjust-product": {
            let inputQuantity = result[1].closest(".cart-item__quantity").querySelector(".item__quantity-input-number");
            const productId = result[1].closest(".cart-item").querySelector(".product-id").value;

            if (result[1].classList.contains("item__quantity-number--plus")) {
                inputQuantity.value = +inputQuantity.value + 1;
            }
            if (result[1].classList.contains("item__quantity-number--minus")) {
                if (+inputQuantity.value > 1) {
                    inputQuantity.value = +inputQuantity.value - 1;
                }
            }

            await updateCart(productId, result[1]);
            showTotalPrice().then();
            break;
        }

        case "input-product": {
            let inputQuantity = result[1].closest(".cart-item__quantity").querySelector(".item__quantity-input-number");
            const productId = result[1].closest(".cart-item").querySelector(".product-id").value;
            result[1].addEventListener("input", async (e) => {
                inputQuantity.value = e.target.value.replace(/^0+/, "").replace(/[^0-9]/g, "");
                await updateCart(productId, result[1]);
            });
            break;
        }

        case "buy-product": {
            event.preventDefault();
            if (isCheckboxChecked()) {
                return "/checkout";
            }
            showAlertPopup("Bạn chưa chọn sản phẩm nào để mua.");
            break;
        }

        case "remove-product": {
            event.preventDefault();
            const currentCartItem = result[1].closest(".cart-item");
            const productId = currentCartItem.querySelector(".product-id").value;
            const quantity = currentCartItem.querySelector(".item__quantity-input-number").value;

            removeCartItem(productId, quantity).then((result) => {
                if (result.success) {
                    reRenderCartItems(currentCartItem, productId);
                }
            });

            break;
        }

        case "buy-now": {
            return "/";
        }

        case "item-link": {
            event.preventDefault();
            return result[1].href;
        }
    }
}
