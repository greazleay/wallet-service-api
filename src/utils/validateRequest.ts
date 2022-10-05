import { validate, ValidatorOptions } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export const validateRequest = async (dto: ClassConstructor<{}>, sourceData: any) => {

    const validatorOptions: ValidatorOptions = {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true
    }

    return await validate(plainToInstance(dto, sourceData), validatorOptions);

}