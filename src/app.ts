import express, {
    Application,
    NextFunction,
    Request,
    Response
} from 'express';
import cookieParser from 'cookie-parser';
import createHttpError from 'http-errors';
import morgan from 'morgan';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { HttpException } from '@exceptions/http.exceptions'
import { ENV, corsOptions } from '@config/configuration';

// Import Configs
import { passportConfig } from '@middlewares/passport';

// Import Routes
import { ApiRouter } from '@routes/api/api.route';
import { IndexRouter } from '@routes/index.route';


export class App {

    private readonly app: Application = express();

    constructor() {

        // Load Passport configuration
        passportConfig(passport);

        this.initializeMiddlewares()
        this.initializeRoutes()
        this.initializeErrorHandlers()
    };

    private initializeMiddlewares() {

        this.app
            .use(morgan('dev'))
            .use(express.json({ limit: '16mb' }))
            .use(express.urlencoded({ limit: '16mb', extended: true }))
            .use(passport.initialize())
            .use(cookieParser(ENV.COOKIE_SECRET))
            .use(cors(corsOptions))
            .use(helmet())
            .use(compression())
    }

    private initializeRoutes() {
        this.app
            .use('/', new IndexRouter().getRoutes())
            .use('/v1', new ApiRouter().getRoutes());
    }

    private initializeErrorHandlers() {
        // Handle 404 errors
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            next(createHttpError(404, 'The requested resource was not found on this server!!!'));
        });

        // Error handler
        this.app.use((error: HttpException, req: Request, res: Response, next: NextFunction) => {
            res.status(error.statusCode ?? 500).json(error);
        })
    }

    public getApp() {
        return this.app
    }
}