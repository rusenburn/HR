export interface BaseQueryModel{
    limit:number;
    skip:number;
};
export const defaultBaseQuery:BaseQueryModel={
    skip:0,
    limit:2147483647
};