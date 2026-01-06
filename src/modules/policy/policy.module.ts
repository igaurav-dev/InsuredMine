import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';
import { Policy, PolicySchema } from '../../schemas/policy.schema';
import { User, UserSchema } from '../../schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Policy.name, schema: PolicySchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [PolicyController],
    providers: [PolicyService],
})
export class PolicyModule { }
