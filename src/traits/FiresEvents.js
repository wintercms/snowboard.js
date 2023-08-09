/**
 * Widget event handler.
 *
 * Extends a widget with event handling functionality, allowing for the quick definition of events
 * and listening for events on a specific instance of a widget.
 *
 * This is a complement to Snowboard's global events - these events will still fire in order to
 * allow external code to listen and handle events. Local events can cancel the global event (and
 * further local events) by returning `false` from the callback.
 *
 * @copyright 2022 Winter.
 * @author Ben Thomson <git@alfreido.com>
 */
export default class FiresEvents {
    /**
     * Trait constructor and definition.
     */
    constructor() {
        this.events = [];
        this.localEventsOnly = false;
    }

    /**
     * Instance constructor.
     */
    construct() {
        if (!this.localEventsOnly && !this.eventPrefix) {
            throw new Error('Event prefix is required if global events are enabled.');
        }
    }

    /**
     * Registers a listener for a widget's event.
     *
     * @param {String} event
     * @param {Function} callback
     */
    on(event, callback) {
        this.events.push({
            event,
            callback,
        });
    }

    /**
     * Deregisters a listener for a widget's event.
     *
     * @param {String} event
     * @param {Function} callback
     */
    off(event, callback) {
        this.events = this.events.filter(
            (registeredEvent) => registeredEvent.event !== event
                || registeredEvent.callback !== callback,
        );
    }

    /**
     * Registers a listener for a widget's event that will only fire once.
     *
     * @param {String} event
     * @param {Function} callback
     */
    once(event, callback) {
        const length = this.events.push({
            event,
            callback: (...parameters) => {
                callback(...parameters);
                this.events.splice(length - 1, 1);
            },
        });
    }

    /**
     * Triggers an event on the widget.
     *
     * Local events are triggered first, then a global event is sent afterwards.
     *
     * @param {String} eventName
     * @param  {...any} parameters
     */
    triggerEvent(eventName, ...parameters) {
        // Fire local events first
        const events = this.events.filter((registeredEvent) => registeredEvent.event === eventName);

        if (events.length === 0) {
            return;
        }

        let cancelled = false;
        events.forEach((event) => {
            if (cancelled) {
                return;
            }
            if (event.callback(...parameters) === false) {
                cancelled = true;
            }
        });

        if (!cancelled && !this.localEventsOnly) {
            this.snowboard.globalEvent(`${this.eventPrefix}.${eventName}`, ...parameters);
        }
    }

    /**
     * Fires a promise event on the widget.
     *
     * Local events are triggered first, then a global promise event is sent afterwards.
     *
     * @param {String} eventName
     * @param  {...any} parameters
     */
    triggerPromiseEvent(eventName, ...parameters) {
        const events = this.events.filter((registeredEvent) => registeredEvent.event === eventName);

        if (events.length === 0) {
            return;
        }

        const promises = events.filter(
            (event) => event !== null,
            events.map((event) => event.callback(...parameters)),
        );

        Promise.all(promises).then(
            () => {
                if (!this.localEventsOnly) {
                    this.snowboard.globalPromiseEvent(`${this.eventPrefix}.${eventName}`, ...parameters);
                }
            },
            () => {},
        );
    }
}
