import React from 'react'

import './styles.scss'

import {
	DomHelper,
} from '../utils'

const suggestions = [
	"Do you have time to meet next week?",
	"I have forwarded this message to the appropriate service rep.",
	"If you're not the right person, can you please put me in touch with whoever is?",
	"Thanks again for chatting today and I look forward to hearing from you!"
]

const highlightPercent = 0.4

/**
 * Calculate duplication.
 * @constructor
 * @param {string} value
 * @param {string} suggestion
 */
function calcDuplication(value, suggestion, minRate = 0.4) {
	if (!value || value.length <= 0 || !suggestion || suggestion.length <= 0) return ''

	const v = value.toLowerCase()
	const minLen = suggestion.length * minRate
	let result = ''
	for (let index = minLen; index < suggestion.length; index++) {
		const s = suggestion.slice(0, index).toLowerCase()

		const tmp = v.replace(s, '') + s

		if (tmp === v) result = suggestion.slice(0, index)
	}

	return result
}

export function DecorationEl({
	msgBodyEl,
	parentEl
}) {
	const containerRef = React.useRef()

	React.useEffect(() => {
		updateMsgBody()
	}, [msgBodyEl])

	const [value, setValue] = React.useState('')
	const [children, setChildren] = React.useState([])

	const [suggestion, setSuggestion] = React.useState(null)
	const [highlight, setHighlight] = React.useState(null)

	React.useEffect(() => {
		setChildren(DomHelper.parseDOM(value))
		handleHighlight()
	}, [value])

	function updateMsgBody() {
		if (!msgBodyEl || !containerRef.current) return

		DomHelper.copyStyle(msgBodyEl, containerRef.current)
		containerRef.current.style.width = '100%'
		containerRef.current.style.height = '100%'
		// containerRef.current.style.opacity = 0

		const observer = new MutationObserver(handleMsgChanged)
		observer.observe(msgBodyEl, { childList: true, subtree: true, characterData: true, characterDataOldValue: true })

		msgBodyEl.addEventListener('keydown', handleKeyPress, false)
	}

	function handleHighlight() {
		let s = null, h = null
		for (let suggestion of suggestions) {
			const duplication = calcDuplication(value, suggestion)
			if (duplication && duplication.length >= 0) {
				s = suggestion
				h = suggestion.replace(duplication, '')
				break
			}
		}

		setSuggestion(s)
		setHighlight(h)
	}

	function handleMsgChanged() {
		if (!msgBodyEl) return

		setValue(msgBodyEl.innerHTML)
	}

	function handleKeyPress(event) {
		const highlightEl = containerRef.current.querySelector('.pragma-crx-container-highlight')

		if (event.keyCode === 9 && highlightEl) {
			event.preventDefault()
			event.stopPropagation()

			const newHTML = msgBodyEl.innerHTML + highlightEl.innerHTML
			console.log(newHTML)

			msgBodyEl.innerHTML = newHTML

			setHighlight(null)
		}
	}

	return (
		<div ref={containerRef}>
			<span dangerouslySetInnerHTML={{ __html: value }}></span>
			{highlight && <span className="pragma-crx-container-highlight">{highlight}</span>}
		</div>
	)
}


export * from './scripts'