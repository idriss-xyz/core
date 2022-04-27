import {AsyncCache} from "../AsyncCache";

export class TwitterIdResolver {
    cache = AsyncCache.TwitterID;

    get(name) {
        name = name.replace(/^@/, '');
        return this.cache.getOne(name, async () => (await this.apiCall([name]))[name])
    }

    preloadMany(names) {
        names=names.map(x => x.replace(/^@/, ''));
        return this.cache.preloadMany(names, async () => (await this.apiCall(names)))
    }

    async apiCall(names) {
        const request = await fetch("https://www.idriss.xyz/v1/getTwitterIDPlugin?usernames=" + encodeURIComponent(names.join(',')));
        const response = await request.json();
        return response.twitterIDs;
    }
}