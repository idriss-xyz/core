export class AsyncCache {
    static TwitterID = new AsyncCache('TwitterID');
    promises = {}

    constructor(name, expirationTime = 3600000) {
        this.name = name;
        this.expirationTime = expirationTime;
    }

    async getOne(args) {
        let str = JSON.stringify([this.name, args]);

        let response = (await chrome.storage.local.get('cache' + str))['cache' + str];
        if (response && new Date() - response.date < this.expirationTime) {
            return {value: response.value};
        }
        return null;
    }

    async setOne(args, value) {
        let str = JSON.stringify([this.name, args]);

        let obj = {};
        obj['cache' + str] = {date: +new Date(), value}
        await chrome.storage.local.set(obj)
    }
}
