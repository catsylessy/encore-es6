/**
 * onBreakpoint
 *
 * @param object config
 * 
 * @example
 *  
    onBreakpoint({
        down: {
            480: function() {
                console.log('click! down 480');
            },
            980: function() {
                console.log('click! down 980', this);
            }
        },
        up: { ... },
        equal: { ... }
    })
 * 
 * @return function wrapperFunc
 */
export function onBreakpoint(config) {

    let is = {
        'down': (threshold, size) => size < threshold,
        'up': (threshold, size) => size > threshold,
        'equal': (threshold, size) => size == threshold
    }

    let wrapperFunc = function () {
        let context = this
        for (let y = 0; y < Object.keys(config).length; y++) {
            const expression = Object.keys(config)[y];
            // get all declared thresholds
            let thresholds = config[expression]
            if (!is.hasOwnProperty(expression)) return;
            for (let x = 0; x < Object.keys(thresholds).length; x++) {
                // get single threshold
                const triggerThreshold = parseInt(Object.keys(thresholds)[x])
                // if threshold is matched we can call the original function
                if (is[expression](triggerThreshold, window.innerWidth)) {
                    thresholds[triggerThreshold].call(context)
                }
            }
        }
    }

    return wrapperFunc
}