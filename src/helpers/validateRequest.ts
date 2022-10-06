import { validate, ValidatorOptions } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationException } from '@exceptions/common.exceptions';


export const validateRequest = async (dto: ClassConstructor<any>, sourceData: any) => {

    const validatorOptions: ValidatorOptions = {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true
    };

    const requestDto = plainToInstance(dto, sourceData);

    const errors = await validate(requestDto, validatorOptions);

    if (errors.length) {

        const errorData = errors.map(err => {
            return {
                property: err.property,
                error: err.constraints
            }
        });

        throw new ValidationException(errorData);

    } else {

        return requestDto;
    }

}