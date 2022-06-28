import React from 'react'
import ReactDOM from 'react-dom'

import { DecorationEl } from './'

export const decoration = (function () {
	const msgBodySelector = 'div[aria-label="Message Body"]'

	const containerCls = 'pragma-crx-container'
	const attributeName = 'data-pragma-el'

	const selectors = [".menu-button[role='menuitem']"]

	var eventMatchers = {
		'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
		'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
	}
	var defaultOptions = {
		pointerX: 0,
		pointerY: 0,
		button: 0,
		ctrlKey: false,
		altKey: false,
		shiftKey: false,
		metaKey: false,
		bubbles: true,
		cancelable: true
	}

	// const selectors = ["#docs-menubar[role='menubar'] #docs-file-menu:first-child"]

	function run() {
		document.removeEventListener('keyup', handleDocKeyUp)
		document.addEventListener('keyup', handleDocKeyUp, false)
	}

	function handleDocKeyUp(event) {
		const { key, keyCode, altKey } = event
		if (key !== 'Alt') return

		event.stopPropagation()
		event.preventDefault()

		// console.log(key, keyCode, altKey)

		document.activeElement?.blur()

		process()
	}

	function reset() {
		const els = document.querySelectorAll(`*[${attributeName}]`)
		for (let el of els) {
			el.removeAttribute(attributeName)
		}
	}

	function extend(destination, source) {
		for (var property in source)
		  destination[property] = source[property];
		return destination;
	}

	function simulate(element, eventName) {
		var options = extend(defaultOptions, arguments[2] || {});
		var oEvent, eventType = null;

		for (var name in eventMatchers)
		{
			if (eventMatchers[name].test(eventName)) { eventType = name; break; }
		}

		if (!eventType)
			throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

		if (document.createEvent)
		{
			oEvent = document.createEvent(eventType);
			if (eventType == 'HTMLEvents')
			{
				oEvent.initEvent(eventName, options.bubbles, options.cancelable);
			}
			else
			{
				oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
				options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
				options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
			}
			element.dispatchEvent(oEvent);
		}
		else
		{
			options.clientX = options.pointerX;
			options.clientY = options.pointerY;
			var evt = document.createEventObject();
			oEvent = extend(evt, options);
			element.fireEvent('on' + eventName, oEvent);
		}
		return element;
	}

	function process() {
		let keyMap = []
		for (let selector of selectors) {
			const els = document.querySelectorAll(selector)
			for (let el of els) {
				try {
					if (el.hasAttribute(attributeName)) continue
					if (!el.getAttribute('aria-haspopup')) continue

					const style = getComputedStyle(el)
					if (style.display === 'none') continue

					let content = el.innerHTML
					const key = content.charAt(0)?.toLowerCase()
					if (keyMap.includes(key)) continue

					content = key?.toUpperCase()
					el.setAttribute(attributeName, content)

					document.addEventListener('keyup', (event) => {
						if (event.key !== key) return

						event.stopPropagation()
						event.preventDefault()

						console.log(el)
						simulate(el, "mousedown");
						reset()
					}, false)

				} catch (error) {
					console.log(error)
				}

				break
			}
		}
	}

	return { run }
})()