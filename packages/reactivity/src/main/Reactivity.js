import { Singleton } from '@wintercms/snowboard';
import Alpine from 'alpinejs';

export default class Reactivity extends Singleton {
    construct() {
        this.alpine = Alpine;
        window.Alpine = this.alpine;

        this.alpine.start();
    }
}
