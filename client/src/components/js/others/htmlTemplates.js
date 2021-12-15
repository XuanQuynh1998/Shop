export function cartProductHtml(productName, numberProduct, price, img, slug) {
    return `<li class="header__cart-item">
        <a href="/products/${slug}" class="header__cart-item-link" header-attr="header-link">
          <img src="${img}" alt=""
            class="header__cart-img">
          <div class="header__cart-item-info">
            <div class="header__cart-item-head">
              <h5 class="header__cart-item-name">${productName}</h5>
              <div class="header__cart-item-price-wrap">
                <span class="header__cart-item-price">${price}</span>
                <span class="header__cart-item-multiply">x</span>
                <span class="header__cart-item-qnt">${numberProduct}</span>
              </div>
            </div>
            <div class="header__cart-item-body">
              <span class="header__cart-item-decription">
                Phân loại: Bạc
              </span>
              <span class="header__cart-item-remove" product-attr="remove-cart-product">Xóa</span>
            </div>
          </div>
          <input type="hidden" class="product-id" value=${slug}>
          </a>
        </li>`;
}

export function selectDateHtml(currentDate, dateType) {
    let dateString = "";

    switch (dateType) {
        case "day": {
            for (let i = 1; i <= 31; i++) {
                if (i !== +currentDate) {
                    dateString += `<li class="account-section-profile__left-item-content-birthday-item" profile-attr="date">${i}</li>`;
                }
            }
            break;
        }

        case "month": {
            const currentMonth = currentDate.split(" ")[1];

            for (let i = 1; i <= 12; i++) {
                if (i !== +currentMonth) {
                    dateString += `<li class="account-section-profile__left-item-content-birthday-item" profile-attr="date">Tháng ${i}</li>`;
                }
            }
            break;
        }

        case "year": {
            const currentYear = new Date().getFullYear();

            for (let i = currentYear; i >= 1900; i--) {
                if (i !== +currentDate) {
                    dateString += `<li class="account-section-profile__left-item-content-birthday-item" profile-attr="date">${i}</li>`;
                }
            }
        }
    }

    return `
     <ul class="account-section-profile__left-item-content-birthday-select-wrap">
           ${dateString}
     </ul>
    `;
}

export function noCartListHtml() {
    return `<div class="cart-item__no-item">
    <div class="cart-item__no-item-image"></div>
    <div class="cart-item__no-item-text">Giỏ hàng của bạn còn trống</div>
    <button class="btn btn--primary cart-item__buy-now" cart-attr="buy-now">Mua ngay</button>
  </div>`;
}

export function currentAddressHtml(addressInfo) {
    return `<div class="checkout-info__customer-container">
  <div class="checkout-info__customer-wrap">
      <div class="checkout-info__customer-name">${addressInfo.fullName}</div>
      <div class="checkout-info__customer-phone">${addressInfo.phone}</div>
  </div>
  <div class="checkout-info__location-wrap">
      <div class="checkout-info__location">${addressInfo.address.join(", ")}</div>
  </div>
  <div class="checkout-info__change-location-wrap">
      <i class="fas fa-edit checkout-info__change-location-icon"></i>
      <div class="checkout-info__change-location" checkout-attr="change-address">Thay đổi</div>
  </div>
  <input type="hidden" id="address-id" value="${addressInfo._id}">
</div>`;
}

export function changeAddressHtml(addressData) {
    return `<div class="checkout-info__list-address-container">
  <div class="checkout-info__list-address-config-btn">
      <button class="btn btn--normal checkout-info__list-address-add-address">
          <i class="fas fa-plus checkout-info__list-address-add-address-icon"></i>
          <div class="checkout-info__list-address-add-address-text">
              Thêm Địa Chỉ Mới
          </div>
      </button>
      <button class="btn btn--normal checkout-info__list-address-config-page">Thiết lập Địa
          Chỉ</button>
  </div>
  <div class="checkout-info__list-address">
      ${addressData
          .map((data) => {
              const currentAddressInfo = document.querySelector(".checkout-info__customer-container");
              const currentAddressId = currentAddressInfo.querySelector("#address-id").value;

              if (currentAddressId === data._id) {
                  return `<label class="checkout-info__list-address-item">
                              <input type="radio" name="address" class="checkout-info__list-address-radio" checked>
                              <div class="checkout-info__list-address-customer">
                                  <div class="checkout-info__list-address-customer-name">${data.fullName}</div>
                                  <div class="checkout-info__list-address-customer-phone">${data.phone}</div>
                              </div>
                              <div class="checkout-info__list-address-location-wrap">
                                  <div class="checkout-info__list-address-location">${data.address}
                                  </div>
                              </div>
                              <input type="hidden" class="address-id" value="${data._id}">
                          </label>`;
              } else {
                  return `<label class="checkout-info__list-address-item">
                            <input type="radio" name="address" class="checkout-info__list-address-radio">
                            <div class="checkout-info__list-address-customer">
                                <div class="checkout-info__list-address-customer-name">${data.fullName}</div>
                                <div class="checkout-info__list-address-customer-phone">${data.phone}</div>
                            </div>
                            <div class="checkout-info__list-address-location-wrap">
                                <div class="checkout-info__list-address-location">${data.address}
                                </div>
                            </div>
                            <input type="hidden" class="address-id" value="${data._id}">
                        </label>`;
              }
          })
          .join("")}
  </div>

  <div class="checkout-info__list-address-btn-wrap">
      <button class="btn btn--primary checkout-info__list-address-btn-submit" checkout-attr="submit-address">Hoàn Thành</button>
      <button class="btn btn--normal checkout-info__list-address-btn-back" checkout-attr="back">Trở Lại</button>
  </div>
</div>`;
}

export function menuAuthHtml() {
    return `<div class="header-mobile-menu__options-wrap">
    <div class="header-mobile-menu__options">
        <div class="header-mobile-menu__user">
            <div class="header-mobile-menu__user-avatar"
                style="background-image: url(https://lh3.googleusercontent.com/d/1YjsnvDeH0jbVa3_xRNuZLM44zDiSm-EN)">
            </div>
        <div class="header-mobile-menu__user-name">Khách lẻ</div>
  </div>
        <div class="header-mobile-menu__auth">
            <button class="btn btn--primary header-mobile-menu__auth-login header-login" header-attr="authentication">Đăng Nhập</button>
            <button class="btn btn--normal header-mobile-menu__auth-register header-register" header-attr="authentication">Đăng Ký</button>
        </div>
    </div>
  </div>`;
}

export function headerMenuHtml(username) {
    return `<div class="header-mobile-menu__options-wrap">
    <div class="header-mobile-menu__options">
    <div class="header-mobile-menu__user">
      <div class="header-mobile-menu__user-avatar"
        style="background-image: url(https://lh3.googleusercontent.com/d/1YjsnvDeH0jbVa3_xRNuZLM44zDiSm-EN)">
      </div>
      <div class="header-mobile-menu__user-name">${username}</div>
    </div>
    <div class="header-mobile-menu__user-link">
      <a class="header-mobile-menu__user-link-item" href="/account/profile" header-attr="menu-link">
        <i class="far fa-user-circle header-mobile-menu__user-link-item-icon"></i>
        <div class="header-mobile-menu__user-link-item-text">Tài khoản của tôi</div>
      </a>
      <a class="header-mobile-menu__user-link-item" href="/account/addresses" header-attr="menu-link">
        <i class="fas fa-map-marker-alt header-mobile-menu__user-link-item-icon"></i>
        <div class="header-mobile-menu__user-link-item-text">Địa Chỉ của tôi</div>
      </a>
      <a class="header-mobile-menu__user-link-item" href="/account/purchase" header-attr="menu-link">
        <i class="fas fa-clipboard-list header-mobile-menu__user-link-item-icon"></i>
        <div class="header-mobile-menu__user-link-item-text">Đơn mua</div>
      </a>
      <a class="header-mobile-menu__user-link-item" header-attr="logout">
        <i class="fas fa-sign-out-alt header-mobile-menu__user-link-item-icon"></i>
        <div class="header-mobile-menu__user-link-item-text">Đăng xuất</div>
      </a>
    </div>
  </div>
  </div>`;
}
