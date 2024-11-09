import {AsyncCache} from "../AsyncCache";


export const TwitterIdResolver = {
    cache: AsyncCache.TwitterID,
    async get(name) {
        name = name.replace(/^@/, '').toLowerCase();
        let cacheResponse
        try {cacheResponse = await this.cache.getOne(name);}
        catch {cacheResponse=""}
        if (cacheResponse) return cacheResponse.value
        else {
            let value = (await this.apiCall([name]))[name];
            this.cache.setOne(name, value);
            return value;
        }
    },
    async getMany(originalNames) {
        let names = originalNames.map(x => x.replace(/^@/, '').toLowerCase());

        let toRead = [];
        let ret = [];

        for (let name of names) {
            let cacheResponse = await this.cache.getOne(name);
            if (cacheResponse) {
                ret.push([name, cacheResponse.value]);
            } else {
                toRead.push(name);
            }
        }
        if (toRead.length > 0) {
            let results = await this.apiCall(toRead)
            for (const name of toRead) {
                let value = results[name.replace(/^@/, '').toLowerCase()];
                ret.push([name, value]);
                this.cache.setOne(name, value);
            }
        }

        return Object.fromEntries(ret.map(([k, v]) => [originalNames.filter(x => x.replace(/^@/, '').toLowerCase() == k)[0], v]));
    },
    async apiCall(names) {
        const request = await fetch("https://api.idriss.xyz/v2/getTwitterIDPlugin?usernames=" + encodeURIComponent(names.join(',')));
        const response = await request.json();
        return Object.fromEntries(Object.entries(response).map(x => [x[0].toLowerCase(), x[1]]));
    }
}