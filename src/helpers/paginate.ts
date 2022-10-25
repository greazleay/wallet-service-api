import { Request } from 'express';
import { plainToInstance, Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'


interface PageMetaDtoParameters {
    pageOptionsDto: PageOptionsDto;
    itemCount: number;
}

class PageOptionsDto {

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    readonly perPage?: number = 10;

    get skip(): number {
        return (this.page as number - 1) * (this.perPage as number);
    }
}

class PageMetaDto {

    readonly page: number;
    readonly perPage: number;
    readonly itemCount: number;
    readonly pageCount: number;
    readonly hasPreviousPage: boolean;
    readonly hasNextPage: boolean;

    constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
        this.page = pageOptionsDto.page as number;
        this.perPage = pageOptionsDto.perPage as number;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.perPage);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}

class PageDto<T> {

    readonly data: T[];
    readonly meta: PageMetaDto;

    constructor(data: T[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}

export const pageOptions = (req: Request) => {
    return plainToInstance(PageOptionsDto, req.query);
}

export const paginate = <T>(pageOptionsDto: PageOptionsDto, data: [T[], number]) => {

    const [entities, itemCount] = data;

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);

}