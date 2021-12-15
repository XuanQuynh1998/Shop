import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super();
    }

    async getHtml() {
        const userInfo = await $.ajax({
            url: '/user_info/profile',
        });

        return Handlebars.templates['profile'](userInfo);
    }
}