import FileSaver from 'file-saver'
import { randomPrompts } from '../constants'

export function getRandomPrompt(prompt) {
	const randomIndex = Math.floor(Math.random() * randomPrompts.length)
	const randomPrompt = randomPrompts[randomIndex]
	if (randomPrompt === prompt) return getRandomPrompt(prompt)
	return randomPrompt
}

export function downloadImage(_id, photo) {
	FileSaver.saveAs(photo, `download-${_id}.jpg`)
}