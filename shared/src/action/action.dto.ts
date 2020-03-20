export interface IActionDto {
    readonly name: string;
    readonly description: string;
    readonly body: string
}

export interface IActionExecutionBodyDto {
    readonly [key: string]: any;
}
