import { logger } from '@helpers/logger'


export const Controller = (name?: string) => {
    return (constructor: Function) => {
        logger.info(`${name ? `${name} Contoller instantaited` : `${constructor.name} instantiated}`}`)
    }
}