export class RequestLimiter {
    constructor(limits = [{time: 1000, amount: 40}]) {
        this.limits = limits;
        this.working = [];
        this.waiting = [];
    }

    isGood(howMuch = 1) {
        for (const limit of this.limits) {
            const now = new Date();
            const count = this.working.filter(x => now - x.start <= limit.time).map(x => x.count).reduce((a, b) => a + b, 0);
            if (count + howMuch > limit.amount) {
                return false;
            }
        }
        return true;
    }

    scheduleOne(item, callback) {
        return this.scheduleGroup([item], callback)
    }

    scheduleMany(array, callback) {
        let groups = [];
        const size = this.limits[0].amount;
        for (let i = 0; i < array.length; i += size) {
            groups.push(array.slice(i, size));
        }
        return Promise.all(groups.map(x => this.scheduleGroup(x, callback)))
    }

    scheduleGroup(array, callback) {
        if (this.isGood(array.length)) {
            return this.run(array, callback);
        } else {
            return new Promise((resolve, reject) => {
                this.waiting.push({callback, resolve, reject});
            });
        }
    }

    async run(data, callback) {
        const obj = {data, callback, count: data.length, start: new Date};
        this.working.push(obj)
        setTimeout(() => this.tryNext(), this.limits[0].time);
        try {
            return await callback(data);
        } finally {
            this.working.splice(this.working.indexOf(obj), 1);
        }
    }

    tryNext() {
        while (this.waiting.length > 0 && this.isGood(this.waiting[0].count)) {
            const waiting = this.waiting.pop();
            this.run(waiting.data, waiting.callback).then(waiting.resolve, waiting.reject);
        }
        if (this.waiting.length > 0) {
            setTimeout(() => this.tryNext(), this.limits[0].time);
        }
    }
}