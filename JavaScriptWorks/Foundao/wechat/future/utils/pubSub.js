export default class PubSub {
    constructor() {
        this.PubSubCache = {
            $uid: 0
        };
    }

    on(type, handler) {
        let cache = this.PubSubCache[type] || (this.PubSubCache[type] = {});    //重复绑定时触发

        handler.$uid = handler.$uid || this.PubSubCache.$uid++;
        cache[handler.$uid] = handler;
    }

    emit(type, ...param) {
        let cache = this.PubSubCache[type],
            key,
            tmp;

        if(!cache) return;

        for(key in cache) {
            tmp = cache[key];
            cache[key].call(this, ...param);
        }
    }

    off(type, handler) {
        let counter = 0,
            $type,
            cache = this.PubSubCache[type];

        if(handler == null) {
            if(!cache) return true;
            return !!this.PubSubCache[type] && (delete this.PubSubCache[type]);
        } else {
            !!this.PubSubCache[type] && (delete this.PubSubCache[type][handler.$uid]);
        }

        for($type in cache) {
            counter++;
        }

        return !counter && (delete this.PubSubCache[type]);
    }
}