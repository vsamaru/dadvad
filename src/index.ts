import { handleRequest } from './handler.ts'

addEventListener('fetch', (event) => {
	B={}
  event.respondWith(handleRequest(event.request))
})
