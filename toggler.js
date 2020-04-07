import { qs, ce } from './utils'
import { addEvent } from './events'

/**
 * Class TogglerManager
 * 
 * manage toggler plugins
 */
export class TogglerManager {

    /** static instance */
    static instance = null

    /** togglers collection */
    togglers = []

    /** last toggled */
    lastToggle = null

    /** static drop */
    drop = null

    constructor() {
        addEvent({
            element: TogglerManager.drop,
            type: 'click',
            withCallback: () => {
                for (let index = 0; index < this.togglers.length; index++)
                    if (this.togglers[index].id === this.lastToggle)
                        this.manageToggler()
            }
        })
    }

    add(togglerObject) {
        this.togglers.push({ isActive: false, ...togglerObject })
    }

    manageToggler(uniqueID) {
        let prevToggle = this.lastToggle
        for (let index = 0; index < this.togglers.length; index++) {
            let toggler = this.togglers[index];
            if (uniqueID === toggler.id) {
                // toggle active
                toggler.isActive = !toggler.isActive
            } else if (prevToggle && (prevToggle === toggler.id) && toggler.isActive) {
                // toggle between togglers
                toggler.toggleCallback(false)
                toggler.isActive = !toggler.isActive
            }
            this.togglers[index] = toggler
        }
        this.lastToggle = uniqueID
    }
}

/** get an instance of TogglerManager */
TogglerManager.getInstance = function () {
    if (!TogglerManager.instance) {
        TogglerManager.drop = ce({
            html: '<div class="e-toggler-drop drop"></div>',
            prependTo: qs('body')
        })
        TogglerManager.instance = new TogglerManager()
    }
    return TogglerManager.instance
}

/**
 * toggler
 *
 * @param mixed config
 * 
 * @example
 * 
 
    toggler({
        trigger: qs('.btn-toggle-top-menu'),
        withDrop: bool,
        close: ce({
            html: '<div class="btn-toggle hide-lg-up"><i class="fa fa-close"></i></div>',
            prependTo: qs('.e-header--bottom .nav-inner')
        })
    })
 
 * @return void
 */
export function toggler({ trigger, close, on, off, withDrop = true }) {
    let target
    let toggled = false
    let manager = TogglerManager.getInstance()
    let uniqueID = +(Math.random() * 1000).toFixed(0)

    try {
        target = qs(trigger.getAttribute('data-target'))
        if (null === target || undefined === target)
            throw target
    }
    catch (e) { return console.warn(`cannot toggle a "${target}" target`) }

    if (close) trigger = [trigger, close]

    const toggleCallback = function (manage = true) {
        // manage this toggler
        target.classList.toggle('show')
        withDrop && TogglerManager.drop.classList.toggle('show')
        if (!toggled && on) on.call(this, target, trigger)
        if (toggled && off) off.call(this, target, trigger)
        // manage all togglers
        if (manage) {
            manager.manageToggler(uniqueID)
        }
        toggled = !toggled
    }

    manager.add({
        id: uniqueID,
        toggleCallback
    })

    return addEvent({
        element: trigger,
        type: 'click',
        withCallback: toggleCallback
    })
}