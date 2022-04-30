import {AsyncCache} from "../AsyncCache";


export const TwitterIdResolver = {
    cache: AsyncCache.TwitterID,
    get(name) {
        name = name.replace(/^@/, '').toLowerCase();
        return this.cache.getOne(name, async () => (await this.apiCall([name]))[name])
    }
    ,
    preloadMany(names) {
        names = names.map(x => x.replace(/^@/, '').toLowerCase());
        return this.cache.preloadMany(names, async () => (await this.apiCall(names)))
    }
    ,
    async apiCall(names) {
        const request = await fetch("https://www.idriss.xyz/v1/getTwitterIDPlugin?usernames=" + encodeURIComponent(names.join(',')));
        const response = await request.json();
        return Object.fromEntries(Object.entries(response.twitterIDs).map(x => [x[0].toLowerCase(), x[1]]));
    }
}