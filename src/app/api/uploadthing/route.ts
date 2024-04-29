import { createRouteHandler } from 'uploadthing/next'
import { ourFileRouter } from './core'

// TODO: Add uploadthing rexported with type components

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
})