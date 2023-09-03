import Alpine from 'alpinejs';
import Singleton from '../../../src/abstracts/Singleton';

export default class Reactivity extends Singleton {
    construct() {
        this.alpine = Alpine;
        window.Alpine = this.alpine;

        this.alpine.start();
    }
}
