import { UserConstants, CodeConstants } from './constants';
class CodeAndMsg {
    CODE: number;
    MESSAGE: string;
}

export class ErrorCode {
    static readonly SUCCESS: CodeAndMsg = { CODE: 0, MESSAGE: 'success' };
    static readonly ERROR: CodeAndMsg = { CODE: 1, MESSAGE: 'fail' };
    static readonly ParamsError: CodeAndMsg = { CODE: 2, MESSAGE: '参数错误' };
    static readonly BugFix: CodeAndMsg = { CODE: 3, MESSAGE: '这可能是个bug' };

    static readonly Forbidden: CodeAndMsg = { CODE: 403, MESSAGE: '没有权限执行此操作' };
    static readonly NotFound: CodeAndMsg = { CODE: 404, MESSAGE: '找不到请求的资源' };

    static readonly LoginError: CodeAndMsg = { CODE: 1000, MESSAGE: '用户名或密码错误' };
    static readonly LoginTimeout: CodeAndMsg = { CODE: 1001, MESSAGE: '登录超时' };
    static readonly InActive: CodeAndMsg = { CODE: 1002, MESSAGE: '账号未激活' };
    static readonly AccountBind: CodeAndMsg = { CODE: 1101, MESSAGE: '账号已绑定' };
    static readonly UserBind: CodeAndMsg = { CODE: 1102, MESSAGE: '账号已绑定' };
    static readonly UserUnBind: CodeAndMsg = { CODE: 1103, MESSAGE: '账号未绑定' };

    static readonly TokenError: CodeAndMsg = { CODE: 1003, MESSAGE: 'token错误' };
    static readonly Frozen: CodeAndMsg = { CODE: 1004, MESSAGE: '账号已冻结' };

    static readonly InvalidUserName: CodeAndMsg = {
        CODE: 1005,
        MESSAGE: `昵称 格式不正确，需要是${UserConstants.USERNAME_MIN_LENGTH}到${UserConstants.USERNAME_MAX_LENGTH}个字符，只能包含英文、中文、下划线，不能包含空格。`,
    };

    static readonly InvalidPhone: CodeAndMsg = { CODE: 1060, MESSAGE: '无效的手机号' };
    static readonly InvalidLogin: CodeAndMsg = { CODE: 1060, MESSAGE: '无效的登录名' };
    static readonly InvalidCaptcha: CodeAndMsg = { CODE: 1061, MESSAGE: '验证码无效或已过期，请重新发送验证码' };
    static readonly RequestRepeat: CodeAndMsg = { CODE: 1062, MESSAGE: `获取验证码间隔为${CodeConstants.CODE_REREPEAT}秒` };
    static readonly CaptchaError: CodeAndMsg = { CODE: 1063, MESSAGE: '验证码不正确' };

    static readonly SendError: CodeAndMsg = { CODE: 1070, MESSAGE: "发送失败" }

    static readonly InvalidPassword: CodeAndMsg = {
        CODE: 1008,
        MESSAGE: `密码需要是${UserConstants.PASSWORD_MIN_LENGTH}到${UserConstants.PASSWORD_MAX_LENGTH}个字符之间`,
    };

    static readonly UserNameExists: CodeAndMsg = { CODE: 1009, MESSAGE: '用户名已存在' };
    static readonly PhoneExists: CodeAndMsg = { CODE: 1010, MESSAGE: '手机号已存在' };
    static readonly UserNoExists: CodeAndMsg = { CODE: 1012, MESSAGE: '用户不存在' };

    static readonly ImageTypeError: CodeAndMsg = { CODE: 1020, MESSAGE: '图片格式不正确' };

    static readonly WeChatLoginQrUseLessError: CodeAndMsg = { CODE: 1101, MESSAGE: '二维码已失效' };

    static readonly OpenClientNoExists: CodeAndMsg = { CODE: 1110, MESSAGE: '客户端不存在' };
    static readonly OpenClientRedirectUriMatch: CodeAndMsg = { CODE: 1111, MESSAGE: '客户端重定向地址匹配失败' };
    static readonly OpenCodeFail: CodeAndMsg = { CODE: 1112, MESSAGE: 'code失效或找不到' };
    static readonly OpenAccessTokenExists: CodeAndMsg = { CODE: 1112, MESSAGE: 'access_token 失效' };

    static CodeToMessage (code: number): string {
        for (const key of Object.keys(this)) {
            if (this[key].CODE === code) {
                return this[key].MESSAGE;
            }
        }
        return '';
    }

    static HasCode (code: number): boolean {
        for (const key of Object.keys(this)) {
            if (this[key].CODE === code) {
                return true;
            }
        }
        return false;
    }
}