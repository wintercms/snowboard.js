import ReactivePluginBase from '../../src/abstracts/ReactivePluginBase';

export default class TestList extends ReactivePluginBase {
    construct() {
        this.names = [
            'Luke',
            'Jack',
            'Marc',
        ];
    }

    template() {
        return `
            <div>
                <ul v-for="name in names">
                    <li v-text="name"></li>
                </ul>
            </div>
        `;
    }

    addName(name) {
        this.names.push(name);
    }
}
