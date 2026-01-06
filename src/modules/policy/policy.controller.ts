import { Controller, Get, Param } from '@nestjs/common';
import { PolicyService } from './policy.service';

@Controller('policy')
export class PolicyController {
    constructor(private readonly policyService: PolicyService) { }

    @Get('search/:username')
    async search(@Param('username') username: string) {
        return this.policyService.searchByUsername(username);
    }

    @Get('aggregated')
    async aggregate() {
        return this.policyService.aggregatePolicies();
    }
}
