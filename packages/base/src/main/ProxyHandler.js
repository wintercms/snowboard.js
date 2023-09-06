export default {
    get(target, prop, receiver) {
        if (typeof prop === 'string' && target.hasAbstract(prop)) {
            return Reflect.get(target, 'abstracts')[prop];
        }
        if (typeof prop === 'string' && target.hasPlugin(prop)) {
            return (...params) => Reflect.get(target, 'plugins')[prop.toLowerCase()]
                .getInstance(...params);
        }

        return Reflect.get(target, prop, receiver);
    },

    has(target, prop) {
        if (typeof prop === 'string' && target.hasAbstract(prop)) {
            return true;
        }
        if (typeof prop === 'string' && target.hasPlugin(prop)) {
            return true;
        }

        return Reflect.has(target, prop);
    },

    deleteProperty(target, prop) {
        if (typeof prop === 'string' && target.hasPlugin(prop)) {
            target.removePlugin(prop);
            return true;
        }

        return false;
    },
};
