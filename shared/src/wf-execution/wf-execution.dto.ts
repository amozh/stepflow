import { Length, IsNotEmpty, IsNumber } from "class-validator"

export class ITestDto2 {
    @Length(1, 4, { message: "Wrong length!" })
    readonly string: string;
    @IsNotEmpty()
    readonly info: string;
    @IsNotEmpty()
    @IsNumber()
    readonly count: number;
}
