import { addEvent } from './events'

/**
 * qs
 * 
 * @param {string} dom 
 * @param {object} ctx
 *  
 * @return DOMElement
 */
export const qs = (dom, ctx = document) => ctx.querySelector(dom)

/**
 * qsa
 *
 * @param {string} dom 
 * @param {object} ctx
 * 
 * @return array DOMElements
 */
export const qsa = (dom, ctx = document) => Array.from(ctx.querySelectorAll(dom))

/**
 * ce
 *
 * @param {string} html
 * @param {object} appendTo
 * @param {object} prependTo
 * 
 * @example
 * 
 
    ce({
        html: '<div class="btn-toggle hide-lg-up"><i class="fa fa-close"></i></div>',
        <prependTo|appendTo>: qs('.e-header--bottom .nav-inner')
    })

 * 
 * @return void
 */
export const ce = ({ html = '', appendTo, prependTo }) => {
    let wrapper = document.createElement('div')
    let element

    wrapper.innerHTML = html
    element = wrapper.firstChild

    if (appendTo) {
        appendTo.appendChild(element)
    } else if (prependTo) {
        prependTo.insertBefore(element, prependTo.firstChild)
    }

    return element
}

/**
 * wap content inside a Node
 * 
 * @param {DOMElement} toWrap 
 * @param {DOMElement} wrapper 
 */
export const wrapInner = (toWrap, wrapper) => {
    wrapper = wrapper || document.createElement('div');
    toWrap.parentNode.appendChild(wrapper);
    return wrapper.appendChild(toWrap);
};

/**
 * disjoint
 *
 * @param {object} DOMElement
 * @param {object} DOMElement
 * 
 * @example
    
    disjoint({
        element: qs('body'),
        withElement: qs('.header')
    })
 
 * @return void
 */
export const disjoint = ({ element, withElement, responsive = true }) => {
    
    const disjoint = () =>
        element.style.paddingTop = `${withElement.clientHeight}px`

    if(responsive) {

        /** execute first time */
        disjoint()

        /** add eventlistener on window resize */
        addEvent({
            type: 'resize',
            element: window,
            withCallback: debounce(disjoint)
        })

    } else disjoint()
}

/**
 * debounce
 * 
 * @param {object} callback 
 * 
 * @return {function} debounce
 */
export function debounce(callback) {
    
    /** save original context */
    const ctx = this

    /** timeout (rAF ID) */
    let timeout

    const loop = () => callback.call(ctx)
    const debounce = () => {
        timeout && window.cancelAnimationFrame(timeout)
        timeout = window.requestAnimationFrame(loop)
    }
    
    return debounce
}

/**
 * extend
 *
 * @param {object} a
 * @param {object} b
 * 
 * @return void
 */
export const extend = (a,b) => {
    if(undefined === b) return a;
    return Object.keys(b).map( key => {
        if(a.hasOwnProperty(key)) {
            a[key] = b[key]
        }
    })
}



/**
 * rAF
 * 
 * requestAnimationFrame
 * cancelAnimationFrame
 * 
 * @return {object} 
 */
export const rAF = ((vendors = ['ms', 'moz', 'webkit', 'o']) => {
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame) {
        let lastTime = 0;
        window.requestAnimationFrame = (callback, element) => {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(() => { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = id => {
            clearTimeout(id);
        };
    }

    return {
        start: window.requestAnimationFrame,
        stop: window.cancelAnimationFrame,
    }
})();