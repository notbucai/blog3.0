import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import * as requestIp from 'request-ip';

export const IpAddress = createParamDecorator((data, ctx: ExecutionContext) => {
	const req = ctx.getArgByIndex(0);

	if (req.clientIp)
		return req.clientIp;
	return requestIp.getClientIp(req); // In case we forgot to include requestIp.mw() in main.ts
});