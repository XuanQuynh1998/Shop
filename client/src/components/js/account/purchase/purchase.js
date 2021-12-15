import { search } from "./purchaseHandle.js";

export function pageHandle(element) {
    const listPurchaseAttr = ["search"];

    let result;
    listPurchaseAttr.some((attr) => {
        if (attr.match(element.getAttribute("purchase-attr"))) {
            result = [attr, element];
            return true;
        }
    });

    switch (result[0]) {
        case "search": {
            result[1].addEventListener("keyup", (e) => {
                if (e.key === "Enter") {
                    search(e.target.value);
                }
            });
            break;
        }
    }
}
