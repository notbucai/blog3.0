import type { IncomingMessage, ServerResponse } from 'http'
import { createProxyMiddleware } from 'http-proxy-middleware'

const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:9905/' : 'http://bucai-blog-server:9905/'

// Temporary dev proxy until @nuxtjs/proxy module is available.

const apiProxyMiddleware = createProxyMiddleware('/api/proxy/**', {
	target: apiUrl,
	changeOrigin: true,
	pathRewrite: { '^/api/proxy/': '' },
	logLevel: 'debug',
})

export default async (req: IncomingMessage, res: ServerResponse) => {
	// Workaround for h3 not awaiting next.
	await new Promise<void>((resolve, reject) => {
		const next = (err?: unknown) => {
			if (err) {
				reject(err)
			} else {
				resolve()
			}
		}
		// @ts-ignore -- typings are incompatible (express.Request vs IncomingMessage)
		apiProxyMiddleware(req, res, next)
	})
}
