const routes = {
    home: "/",
    login: "/login"
} as const

type TypeOfRoutes = (typeof routes)[keyof typeof routes];

export {routes}
export type {TypeOfRoutes}