const  Router = (o = {}) =>
  new Proxy(o, {
    get: (t, k, c) => k === 'handle'
      ? async (q, ...args) => {
          for ([p, hs] of [t.all || [], t[(q.method || 'GET').toLowerCase()] || []].flat()) {
            if (m = (u = new URL(q.url)).pathname.match(p)) {
              q.params = m.groups
              q.query = Object.fromEntries(u.searchParams.entries())

              for (h of hs) {
                if ((s = await h(q, ...args)) !== undefined) return s
              }
            }
          }
          if (o.else) return o.else(q, ...args)
        }
      : (p, ...hs) =>
          (t[k] = t[k] || []).push([
            `^${(o.base || '')+p
              .replace(/(\/?)\*/g, '($1.*)?')
              .replace(/\/$/, '')
              .replace(/:([^\/\?\.]+)(\?)?/g, '$2(?<$1>[^/\.]+)$2')
            }\/*$`,
            hs
          ]) && c
  })
import Posts from './handlers/posts.ts'
import Post from './handlers/post.ts'
import Upd from './handlers/upd.ts'
const router = Router()

// var f = async () => await fetch("https://rebrand.ly/vvy").then( r => r.json() )

router
  .get('/api/posts', Posts)
  .get('/api/posts/:id', Post)
  .get('*', async () => {
  	// var F = await f()
  	// F = JSON.stringify(F,null,4)

  	return new Response("ok", { headers: { 'content-type': 'application/json'} })
})
  .post('/', Upd)

export const handleRequest = request => router.handle(request)