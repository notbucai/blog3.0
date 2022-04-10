import { ObjectID } from "mongodb";

export class UserConstants {
    static readonly USERNAME_MIN_LENGTH: number = 2;
    static readonly USERNAME_MAX_LENGTH: number = 16;
    static readonly PASSWORD_MIN_LENGTH: number = 6;
    static readonly PASSWORD_MAX_LENGTH: number = 20;
    static readonly JOB_MIN_LENGTH: number = 0;
    static readonly JOB_MAX_LENGTH: number = 100;
    static readonly COMPANY_MIN_LENGTH: number = 0;
    static readonly COMPANY_MAX_LENGTH: number = 100;
    static readonly INTRODUCE_MIN_LENGTH: number = 0;
    static readonly INTRODUCE_MAX_LENGTH: number = 100;
    static readonly PERSONAL_HOMEPAGE_MIN_LENGTH: number = 0;
    static readonly PERSONAL_HOMEPAGE__MAX_LENGTH: number = 100;
    static readonly CAPTCHA_LENGTH: number = 6;
}
export class CodeConstants {
    static readonly CODE_REREPEAT: number = 60
}

export enum DateType {
    month = 'month',
    day = 'day'
}
export enum ContentStatus {
    Verifying = 1, // 审核中
    VerifySuccess = 2, // 审核通过
    VerifyFail = 3, // 审核未通过
}
export const ContentStatusLabelMap = {
    [ContentStatus.Verifying]: "审核中",
    [ContentStatus.VerifySuccess]: "审核通过",
    [ContentStatus.VerifyFail]: "审核未通过",
}
export const systemObjectId = new ObjectID('000000000000000000000000');