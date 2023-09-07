import ReactiveSingleton from '../../src/abstracts/ReactiveSingleton';

export default class TestSnowboardTemplate extends ReactiveSingleton {
    construct() {
    }

    template() {
        return `
            <div>
                <strong>{{ snowboard.plugins }}</strong>
            </div>
        `;
    }

    mountTo() {
        return document.body;
    }
}
