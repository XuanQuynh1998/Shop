import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.setTitle("My Shop | Upload");
    }

    async getHtml() {
        return Handlebars.templates["upload"]();
    }
}
