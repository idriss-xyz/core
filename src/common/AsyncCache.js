export class AsyncCache {
    static TwitterID = new AsyncCache('TwitterID');
    static Adresses = new AsyncCache('Adresses');
    promises = {}

    constructor(name, expirationTime = 3600000) {
        this.name = name;
        this.expirationTime = expirationTime;
    }

    async getOne(args, fun) {
        let str = JSON.stringify([this.name, args]);

        let cacheResp = await this.readCache(args);
        if (cacheResp) return cacheResp;
        let date = +new Date();
        let promise = fun();
        this.promises[str] = {date, promise};
        promise.then(a => {
            let obj = {};
            obj['cache' + str] = {date, value: a};
            chrome.storage.local.set(obj);
        });
        return await promise;
    }

    async checkCache(args) {
        let str = JSON.stringify([this.name, args]);

        if (this.promises[str] && new Date() - this.promises[str].date < this.expirationTime) {
            return true;
        }
        let response = (await chrome.storage.local.get('cache' + str))['cache' + str];
        if (response && new Date() - response.date < this.expirationTime) {
            return true;
        }
        return false;
    }

    async readCache(args) {
        let str = JSON.stringify([this.name, args]);

        if (this.promises[str] && new Date() - this.promises[str].date < this.expirationTime) {
            return this.promises[str].promise;
        }
        let response = (await chrome.storage.local.get('cache' + str))['cache' + str];
        if (response && new Date() - response.date < this.expirationTime) {
            return response.value;
        }
        return null;
    }

    async preloadMany(argsArray, fun) {
        let cacheChecks = (await Promise.all(argsArray.map(async x => [x, !(await this.checkCache(x))])));
        let argsArrayOfNeeded = cacheChecks.filter(([x, f]) => f).map(([x, _]) => x);
        let date = +new Date();
        if (argsArrayOfNeeded.length > 0) {
            let promise = Promise.resolve(fun(argsArrayOfNeeded));
            for (let args of argsArray) {
                let str = JSON.stringify([this.name, args]);
                this.promises[str] = {date, promise: promise.then(a => a[str])};
                promise.then(a => {
                    let obj = {};
                    obj['cache' + str] = {date, value: a[str]};
                    chrome.storage.local.set(obj);
                });
            }
        }
    }
}
