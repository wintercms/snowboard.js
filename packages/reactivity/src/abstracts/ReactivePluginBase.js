import { PluginBase } from '@wintercms/snowboard';
import { createApp, reactive } from 'petite-vue';

export default class ReactivePluginBase extends PluginBase {
    constructor(snowboard) {
        super(snowboard);

        this.reactivityInitialized = false;
        this.reactivityStore = {};
        this.reactivityElement = null;

        // Wrap the instance's constructor to call the Reactivity initialisation after construct
        if (typeof this.construct === 'function') {
            this.baseConstruct = this.construct;
            this.construct = (...args) => {
                this.baseConstruct(...args);
                this.reactivityInitialize();
            };
        }
    }

    reactivityInitialize() {
        // Do not re-enable reactivity
        if (this.reactivityInitialized) {
            return;
        }

        const mappable = this.reactivityGetProperties();
        this.reactivityStore = reactive(this.reactivityCreateStore(mappable));
        this.reactivityMapProperties(mappable);
        this.reactivityTemplate();
    }

    reactivityGetProperties() {
        const mappable = {};
        const props = Object.getOwnPropertyDescriptors(this);
        const protoProps = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this));
        const ignore = [
            'snowboard',
            'baseConstruct',
            'constructor',
            'construct',
            'init',
            'template',
            'destruct',
            'destructor',
            'detach',
        ];

        Object.entries(protoProps).forEach(([key, prop]) => {
            if (ignore.includes(key) || key.startsWith('reactivity')) {
                return;
            }

            if (typeof prop.value === 'function') {
                mappable[key] = {
                    type: 'function',
                    value: prop.value,
                };
            } else if (prop.get && typeof prop.get === 'function') {
                mappable[key] = {
                    type: 'getter',
                    value: prop.get,
                };
            } else {
                mappable[key] = {
                    type: 'value',
                    value: prop.value,
                };
            }
        });
        Object.entries(props).forEach(([key, prop]) => {
            if (ignore.includes(key) || key.startsWith('reactivity')) {
                return;
            }

            if (typeof prop.value === 'function') {
                mappable[key] = {
                    type: 'function',
                    value: prop.value,
                };
            } else if (prop.get && typeof prop.get === 'function') {
                mappable[key] = {
                    type: 'getter',
                    value: prop.get,
                };
            } else {
                mappable[key] = {
                    type: 'value',
                    value: prop.value,
                };
            }
        });

        return mappable;
    }

    reactivityCreateStore(mappable) {
        const obj = {};

        Object.entries(mappable).forEach(([key, prop]) => {
            if (prop.type === 'function') {
                Object.defineProperty(obj, key, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value: prop.value,
                });
            } else if (prop.type === 'getter') {
                Object.defineProperty(obj, key, {
                    configurable: true,
                    enumerable: false,
                    get: prop.value,
                });
            } else {
                Object.defineProperty(obj, key, {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: prop.value,
                });
            }
        });

        return obj;
    }

    reactivityMapProperties(mappable) {
        Object.entries(mappable).forEach(([key, prop]) => {
            if (prop.type === 'function' || prop.type === 'getter') {
                Object.defineProperty(
                    this,
                    key,
                    Object.getOwnPropertyDescriptor(this.reactivityStore, key),
                );
            } else {
                Object.defineProperty(this, key, {
                    get() { return this.reactivityStore[key]; },
                    set(value) { this.reactivityStore[key] = value; },
                });
            }
        });
    }

    reactivityTemplate() {
        if (typeof this.template === 'function') {
            const template = this.template();
            if (typeof template === 'string') {
                const parser = new DOMParser();
                const rendered = parser.parseFromString(template, 'text/html');
                if (rendered.body.childNodes > 1) {
                    throw new Error('Template must only have one root node');
                }
                this.reactivityMount(rendered.body.childNodes[0]);
            } else if (template instanceof HTMLElement) {
                this.reactivityMount(template);
            }
        } else if (typeof this.template === 'string') {
            const parser = new DOMParser();
            const rendered = parser.parseFromString(this.template, 'text/html');
            if (rendered.body.childNodes > 1) {
                throw new Error('Template must only have one root node');
            }
            this.reactivityMount(rendered.body.childNodes[0]);
        }
    }

    reactivityMount(element, parent = null) {
        let parentNode = parent;

        if (document.body.contains(element) && !parent) {
            parentNode = element.parentNode;
        } else if (!document.body.contains(element) && !parent) {
            parentNode = document.body;
        }

        if (!document.body.contains(element)) {
            parentNode.appendChild(element);
        }

        createApp(this.reactivityStore).mount(element);
        this.reactivityElement = element;
        this.reactivityInitialized = true;
    }
}