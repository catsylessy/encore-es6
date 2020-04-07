/**
 * addEvent
 *
 * @param object config
 * 
 * @example
 * 
    
    let eventsQueue = addEvent({
        type: 'click',
        element: qs('.btn'),
        withCallback: function() {
            console.log('hello!');
        },
        options: <false|true|{}>
    })

 *
 * @return array eventsQueue
 */
export function addEvent({
    type = '',
    element = window,
    options = { passive: true },
    withCallback = function () { }
}) {
    if (element === undefined || element === null) {
        return false;
    }
    let eventsQueue = []
    const addEvent = function (callback, options, type, index, events) {
        const bindCallback = callback.bind(this)
        this.addEventListener(type, bindCallback, options)
        eventsQueue.push({
            element: this, type, bindCallback, options
        })
    }

    if (Array.isArray(element)) {
        element.forEach(ctxElement =>
            type.split(' ').forEach(addEvent.bind(ctxElement, withCallback, options)))
    } else {
        type.split(' ').forEach(addEvent.bind(element, withCallback, options))
    }

    return eventsQueue
}

/**
 * removeEvent
 *
 * @param array eventsQueue
 * 
 * @example
 * 
  
   removeEvent(eventsQueue[, target<DOMElement|window|document>])

 * 
 * @return void
 */
export function removeEvent(eventsQueue) {
    const targetEvents = arguments.length > 1
        ? eventsQueue.map(event => event.element === arguments[1] ? event : false)
        : eventsQueue

    const removeEvent = function ({ element, type, bindCallback, options }) {
        element && element.removeEventListener(type, bindCallback, options)
    }

    targetEvents.forEach(removeEvent)
}

/**
 * oneEvent
 *
 * @param mixed config
 * 
 * @example
 * 
 
    oneEvent({
        element: qs('.btn'),
        type: 'click',
        withCallback: function() {
            console.log('hello just once!');
        }
    })

 * 
 * @return void
 */
export function oneEvent(config) {
    const originalCallback = config.withCallback
    const withCallback = function (event) {
        originalCallback.call(this, event)
        removeEvent(one)
    }
    delete config['withCallback']
    const one = addEvent({ withCallback, ...config })
}