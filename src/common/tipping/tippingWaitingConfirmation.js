import template from "./tippingWaitingConfirmation.mpts";
import close from "!!url-loader!../img/close.svg"
import twitter from "!!url-loader!../img/twitter.svg"
import {create} from "fast-creator";

export class TippingWaitingConfirmation {
    constructor(identifier) {
        this.html = create('div', {}, template({identifier, close, twitter}));
    }
}