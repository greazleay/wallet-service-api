import { IsNotEmpty, IsUUID } from 'class-validator';


export class EntityIdDto {

    @IsUUID(4)
    @IsNotEmpty()
    id: string;
}