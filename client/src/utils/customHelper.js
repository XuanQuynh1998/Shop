Handlebars.registerHelper("showPrice", function (price, salePrice) {
    return `${(price + salePrice).toLocaleString()}đ`;
});

Handlebars.registerHelper("salePecents", function (price, salePrice) {
    return `${Math.ceil((salePrice / (price + salePrice)) * 100)}%`;
});

Handlebars.registerHelper("totalPrice", function (price, quantity) {
    return `${(price * quantity).toLocaleString()}đ`;
});

Handlebars.registerHelper("totalCheckoutPayment", function (price, shippingFee) {
    return `${(price + shippingFee).toLocaleString()}đ`;
});

Handlebars.registerHelper("totalPayment", function (listItem) {
    let totalPayment = 0;
    listItem.forEach((item) => {
        totalPayment += item.price * item.quantity;
    });
    return `${totalPayment.toLocaleString()}đ`;
});

Handlebars.registerHelper("checkSelectAll", function (listItem) {
    for (let item of listItem) {
        if (item.checked === false) {
            return "";
        }
    }
    return "checked";
});

Handlebars.registerHelper("caculateCheckedPrice", function (listItem) {
    let totalPrice = 0;
    for (let item of listItem) {
        if (item.checked) {
            totalPrice += item.price * item.quantity;
        }
    }
    return `${totalPrice.toLocaleString()}đ`;
});

Handlebars.registerHelper("handleDate", function (date, dateType) {
    switch (dateType) {
        case "day": {
            if (date) {
                const day = date.split("/")[0];
                return day;
            }
            return 1;
        }

        case "month": {
            if (date) {
                const month = date.split("/")[1];
                return `Tháng ${month}`;
            }
            return "Tháng 1";
        }

        case "year": {
            if (date) {
                const year = date.split("/")[2];
                return year;
            }
            return 1990;
        }
    }
});

Handlebars.registerHelper("checkedGender", function (currentGeder, receivedGender) {
    return currentGeder === receivedGender ? "checked" : "";
});

Handlebars.registerHelper("ifEqual", function (a, b, options) {
    if (a === b) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper("ifHasData", function (data, options) {
    if (data.length) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper("orderPrice", function (objectItem) {
    let allPrice = 0;

    objectItem.orderDetail.forEach((order) => {
        allPrice += order.price * order.quantity;
    });

    return `${(allPrice + objectItem.shippingFee).toLocaleString()}đ`;
});

Handlebars.registerHelper("convertOrderDate", function (orderDate) {
    const date = new Date(orderDate);
    return date.toLocaleString();
});

Handlebars.registerHelper("checkUserLogin", async function () {
    const userRes = await $.ajax({
        url: "/api/user",
    });

    console.log(userRes);
});
