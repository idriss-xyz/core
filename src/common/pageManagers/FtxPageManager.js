import {DefaultPageManager} from "./defaultPageManager";

export class FtxPageManager extends DefaultPageManager {
    badWords = ["login", "signup", "email"];
}