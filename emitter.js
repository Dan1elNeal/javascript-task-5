'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!(events[event])) {
                events[event] = [];
            }
            events[event].push({ context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            let suitableEvents = Object.keys(events).filter(eventKey =>
                eventKey.startsWith(event + '.') || eventKey === event);

            const callback = contextAndHandler => contextAndHandler.context === context;
            suitableEvents.forEach(suitableEvent => {
                let index = events[suitableEvent].findIndex(callback);
                while (index !== - 1) {
                    events[suitableEvent].splice(index, 1);
                    index = events[suitableEvent].findIndex(callback);
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let eventParts = parseEvent(event);
            eventParts.forEach(eventPart => {
                if (events[eventPart]) {
                    events[eventPart].forEach(contextAndHandler => {
                        contextAndHandler.handler.apply(contextAndHandler.context);
                    });
                }
            });

            return this;
        }
    };
}

function parseEvent(event) {
    let pieces = event.split('.');
    let eventParts = [];

    for (let i = 0; i < pieces.length; i++) {
        eventParts.push(pieces.slice(0, pieces.length - i).join('.'));
    }

    return eventParts;
}
