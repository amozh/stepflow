export enum ActionType {
    ON_START = "ON_START",
    ON_SUBMIT = "ON_SUBMIT",
    ON_COMPLETE = "ON_COMPLETE",
    CUSTOM = "CUSTOM"
}
export interface IActionDto {
    readonly id?: string,
    readonly name: string,
    readonly actionType?: ActionType,
    readonly description: string,
    readonly alias?: string,
    readonly body: string
}

export interface IActionExecutionBodyDto {
    readonly [key: string]: any;
}

/*export interface IActionDto {
    readonly name: string;
    readonly description: string;
    readonly body: string
}

export interface IActionExecutionBodyDto {
    readonly [key: string]: any;
}
*/