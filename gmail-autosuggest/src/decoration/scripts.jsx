import React from 'react'
import ReactDOM from 'react-dom'

import { DecorationEl } from './'

export const decoration = (function () {
	const msgBodySelector = 'div[aria-label="Message Body"]'

	const containerCls = 'pragma-crx-container'
	let mutationObserver = null

	function appendContainer(msgBody) {
		if (!msgBody || !msgBody.parentElement) {
			return
		}

		const parentEl = msgBody.parentElement
		let container = parentEl.querySelector(`.${containerCls}`)
		if (container) return

		parentEl.style.position = 'relative'

		container = document.createElement('div')
		container.classList.add(containerCls)
		parentEl.insertBefore(container, msgBody)
		ReactDOM.render(
			<DecorationEl
				msgBodyEl={msgBody}
				parentEl={parentEl} />,
			container)
	}

	function run() {
		if (mutationObserver) {
			mutationObserver.disconnect()
			mutationObserver = null
		}

		const msgBodies = document.querySelectorAll(msgBodySelector)
		for (let msgBody of msgBodies) {
			appendContainer(msgBody)
		}

		mutationObserver = new MutationObserver(run)
		mutationObserver.observe(document.body, { childList: true, subtree: true })
	}

	return { run }
})()