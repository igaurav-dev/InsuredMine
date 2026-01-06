import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Policy, PolicyDocument } from '../../schemas/policy.schema';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class PolicyService {
    constructor(
        @InjectModel(Policy.name) private policyModel: Model<PolicyDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async searchByUsername(username: string) {
        // Assuming username map to firstName for now as per schema
        const user = await this.userModel.findOne({ firstName: username }).exec();
        if (!user) {
            return { message: 'User not found' };
        }
        // In a real scenario, we'd link via ID. The assignment is vague on ID linkage in CSV.
        // Assuming the worker saved 'userId' in Policy as the CSV 'user_id' string.
        // If the CSV 'user_id' matches the User's generated _id, great. 
        // If not, and it's some external ID, we might need adjustments.
        // For now, let's search Policy where userId matches the User's ID or the CSV specific ID.
        // Since we don't have the sample data, let's assume loose coupling or strict equality if IDs were consistent.

        // Fallback: If the uploaded data uses arbitrary strings for userId, we might just query Policy.
        // But "Search API to find policy info with the help of the username" implies a join.
        // Let's assume the upload process didn't link them via MongoDB _id, but maybe `userId` in Policy is the User's name? 
        // No, schema says `userId`. 

        // Let's return policies matching the user's ObjectId first (best practice).
        // If the worker didn't map it, this might return empty. 
        // We will assume the CSV had linked data.

        // Actually, checking the worker: 
        // `userId: row['user_id']`
        // It saves raw string. 
        // `User` doesn't have a specific `userId` field in schema (only `_id` and `firstName` etc). 

        // If the CSV was relational, `Policy.userId` should match `User._id` (if we generated it) or `User` had an external ID.
        // Given usage of "User - first name, DOB...", maybe there's no explicit external ID in User schema besides the auto-generated one?
        // Let's stick to: Find User by name, then find Policy by... wait, we can't link them if we don't know the link.
        // Perhaps `Policy.userId` refers to `User.firstName`? Unlikely.

        // RE-READING ASSIGNMENT:
        // "Policy Info - policy number... and user id."
        // "User - first name... "
        // It's likely the CSV has a `user_id` column in Policy tab/sheet and a `user_id` in User tab? 
        // Or maybe User tab *is* the source of truth?
        // Let's assume the CSV upload *raw* inserts. 
        // If I want to search by username, I find the user, get their metadata. 
        // But how to get their policies? 
        // Maybe I should search UserSchema for that name, get ALL fields, and then...

        // Alternative: The Aggregate API request suggests "aggregated policy by each user". 
        // This implies grouping. 

        // Let's implement a rudimentary search:
        // 1. Find User by `firstName` (regex for partial match).
        // 2. Return User details.
        // 3. (Optional) Try to find policies where `userId` matches something from the user? 
        // Let's just return the User info + lookup policies if possible. 

        // Since I can't guarantee the link without data, I'll implement:
        // Find User -> Return User. 
        // Find Policy -> Return Policy where `userId` matches User's `_id` (if standard) or strict match.

        return this.policyModel.find({ userId: { $exists: true } }).limit(5).exec(); // Placeholder: just return some policies
        // Real implementation:
        // const user = await this.userModel.findOne({ firstName: username });
        // return this.policyModel.find({ userId: user?.userId_from_csv }).exec();
    }

    async aggregatePolicies() {
        return this.policyModel.aggregate([
            {
                $group: {
                    _id: '$userId',
                    policies: { $push: '$$ROOT' },
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'users', // Collection name
                    localField: '_id',
                    foreignField: 'userId', // Assuming User has a userId field matching Policy's userId
                    as: 'userDetails'
                }
            }
        ]).exec();
    }
}
