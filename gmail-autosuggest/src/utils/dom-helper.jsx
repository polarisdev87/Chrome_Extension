function copyStyle(from, to) {
	if (!from || !to) return

	const styles = window.getComputedStyle(from);
	if (styles.cssText !== '') {
		to.style.cssText = styles.cssText;
	} else {
		const cssText = Object.values(styles).reduce(
			(css, propertyName) =>
				`${css}${propertyName}:${styles.getPropertyValue(
					propertyName
				)};`
		);

		to.style.cssText = cssText
	}
}

/**
 * Convert string to DOM elements
 * @param {string} value
 */
function parseDOM(value) {
	if (!value) return null

	// console.log(value)

	const parser = new DOMParser()
	const doc = parser.parseFromString(value.replace('&nbsp;', ' ').trim(), 'text/html')

	const errorNode = doc.querySelector('parsererror');
	if (errorNode) return value

	return doc.body.innerHTML
}

export const DomHelper = {
	copyStyle,
	parseDOM
}
