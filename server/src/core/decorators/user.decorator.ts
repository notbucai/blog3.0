import { ContextType, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurUser = createParamDecorator((data, execution: ExecutionContext) => {
    const type = execution.getType<ContextType>();
    const req = execution.switchToHttp().getRequest();
    return req.user;
});