export class RequestLimiter {
    constructor(limits = [{time: 1000, amount: 40}]) {
        this.limits = limits;
        this.working = [];
        this.waiting = [];
    }

    isGood() {
        for (const limit of this.limits) {
            const now = new Date();
            const count = this.working.filter(x => now - x.start <= limit.time);
            if (count >= limit.amount) {
                return false;
            }
        }
        return true;
    }

    schedule(callback) {
        if (this.isGood()) {
            return this.run(callback);
        } else {
            return new Promise((resolve, reject) => {
                this.waiting.push({callback, resolve, reject});
            });
        }
    }

    async run(callback) {
        const obj = {callback, start: new Date};
        this.working.push(obj)
        setTimeout(() => this.tryNext(), this.limits[0].time);
        try {
            return await callback();
        } finally {
            this.working.splice(this.working.indexOf(obj), 1);

        }
    }

    tryNext() {
        while (this.isGood() && this.waiting.length > 0) {
            const waiting = this.waiting.pop();
            this.run(waiting.callback).then(waiting.resolve, waiting.reject);
        }
        if(this.waiting.length > 0){
            setTimeout(() => this.tryNext(), this.limits[0].time);
        }
    }
}