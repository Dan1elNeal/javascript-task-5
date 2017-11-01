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
                eventKey.includes(event + '.') || eventKey === event);

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
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

function parseEvent(event) {
    let pieces = event.split('.');
    let eventParts = [];

    for (let i = 0; i < pieces.length; i++) {
        eventParts.unshift(pieces.slice(0, pieces.length - i).join('.'));
    }

    return eventParts;
}
