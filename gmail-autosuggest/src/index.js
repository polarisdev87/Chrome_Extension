import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import registerServiceWorker from './registerServiceWorker'

require('dotenv').config()

const parentId = 'pragma-fe-test'
let parentEl = document.getElementById(parentId)
// if (!parentEl) {
// 	parentEl = document.createElement('div')
// 	parentEl.id = parentId
// 	parentEl.style.display = 'none'
// 	document.body.appendChild(parentEl)
// }

if (parentEl) {
	ReactDOM.render(<App />, parentEl)
}

// registerServiceWorker()