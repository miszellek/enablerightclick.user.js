// ==UserScript==
// @name         enable Right Click
// @namespace    enableRightClick
// @version      0.1
// @description  enable blocked Right Click (contextmenu)
// @author       miszel
// @match        http://*/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    document.oncontextmenu = null;
    document.body.oncontextmenu = null;

    var enabled = false;

    if (window && typeof window != undefined && document.head != undefined) {

        if (enabled != true) {

            enabled = true;

            window.addEventListener('contextmenu', function contextmenu(event) {
                event.stopPropagation();
                event.stopImmediatePropagation();
                var handler = new eventHandler(event);
                window.removeEventListener(event.type, contextmenu, true);
                var eventsCallBack = new eventsCall(function () {
                });
                handler.fire();
                window.addEventListener(event.type, contextmenu, true);
                if (handler.isCanceled && (eventsCallBack.isCalled)) {
                    event.preventDefault();
                }
            }, true);
        }

        function eventsCall() {
            this.events = ['DOMAttrModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMCharacterDataModified', 'DOMSubtreeModified'];
            this.bind();
        }

        eventsCall.prototype.bind = function () {
            this.events.forEach(function (event) {
                document.addEventListener(event, this, true);
            }.bind(this));
        };

        eventsCall.prototype.handleEvent = function () {
            this.isCalled = true;
        };

        eventsCall.prototype.unbind = function () {
            this.events.forEach(function (event) {
            }.bind(this));
        };

        function eventHandler(event) {
            this.event = event;
            this.contextmenuEvent = this.createEvent(this.event.type);
        }

        eventHandler.prototype.createEvent = function (type) {
            var target = this.event.target;
            var event = target.ownerDocument.createEvent('MouseEvents');
            event.initMouseEvent(
                type, this.event.bubbles, this.event.cancelable,
                target.ownerDocument.defaultView, this.event.detail,
                this.event.screenX, this.event.screenY, this.event.clientX, this.event.clientY,
                this.event.ctrlKey, this.event.altKey, this.event.shiftKey, this.event.metaKey,
                this.event.button, this.event.relatedTarget
            );
            return event;
        };

        eventHandler.prototype.fire = function () {
            var target = this.event.target;
            var contextmenuHandler = function (event) {
                event.preventDefault();
            }.bind(this);
            target.dispatchEvent(this.contextmenuEvent);
            this.isCanceled = this.contextmenuEvent.defaultPrevented;
        };

    }

})();
