import {DefaultPageManager} from "./defaultPageManager";

export class HuobiPageManager extends DefaultPageManager {
    allowedFiled(input) {
        if (this.badWords.some(w => this.document.location.toString().toLowerCase().includes(w))) return false;
        let node = this.getDisallowedNode(input)
        return node === null || node == document.documentElement;
    }
}