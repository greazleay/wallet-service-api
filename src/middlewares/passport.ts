import {
    ExtractJwt,
    Strategy as JwtStrategy,
    StrategyOptions
} from 'passport-jwt';
import { ENV } from '@config/configuration';
import { userRepository } from '@/data-source'


const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ENV.ACCESS_TOKEN_SECRET
};

export const passportConfig = (passport: { use: (arg0: JwtStrategy) => void; }) => {

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {

        try {

            const { sub } = jwt_payload;

            const userExists = await userRepository.findOne({
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    lastLogin: true
                },
                where: { id: sub }
            });

            return userExists ? done(null, userExists) : done(null, false)

        } catch (error: any) {
            done(error, false)
        }
    }));

};