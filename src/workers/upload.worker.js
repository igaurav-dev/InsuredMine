const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const mongoose = require('mongoose');

// Schemas (Need to define inline or require pure JS models as SchemaFactory is NestJS specific)
// For simplicity in worker thread, we'll use raw Mongoose
const connectDB = async (uri) => {
    await mongoose.connect(uri);
};

const AgentSchema = new mongoose.Schema({ name: String });
const UserSchema = new mongoose.Schema({
    firstName: String, dob: String, address: String, phone: String,
    state: String, zip: String, email: String, gender: String, userType: String
});
const UserAccountSchema = new mongoose.Schema({ accountName: String });
const LOBSchema = new mongoose.Schema({ categoryName: String });
const CarrierSchema = new mongoose.Schema({ companyName: String });
const PolicySchema = new mongoose.Schema({
    policyNumber: String, startDate: String, endDate: String,
    collectionId: String, companyCollectionId: String, userId: String
});

const Agent = mongoose.model('Agent', AgentSchema);
const User = mongoose.model('User', UserSchema);
const UserAccount = mongoose.model('UserAccount', UserAccountSchema);
const LOB = mongoose.model('LOB', LOBSchema);
const Carrier = mongoose.model('Carrier', CarrierSchema);
const Policy = mongoose.model('Policy', PolicySchema);

const { filePath, fileType, mongoUri } = workerData;

const processFile = async () => {
    try {
        await connectDB(mongoUri);

        const results = [];
        if (fileType === 'csv') {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    await saveData(results);
                });
        } else if (fileType === 'xlsx') {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);
            await saveData(data);
        }
    } catch (error) {
        parentPort.postMessage({ status: 'error', error: error.message });
        process.exit(1);
    }
};

const saveData = async (data) => {
    try {
        // Bulk operations are more efficient
        const agents = [], users = [], accounts = [], lobs = [], carriers = [], policies = [];

        data.forEach(row => {
            // Mapping logic based on assignment requirements
            // 1) Agent
            agents.push({ name: row['Agent Name'] || row['agent'] });

            // 2) User
            users.push({
                firstName: row['firstname'], dob: row['dob'], address: row['address'],
                phone: row['phone'], state: row['state'], zip: row['zip'],
                email: row['email'], gender: row['gender'], userType: row['userType']
            });

            // 3) User's Account
            accounts.push({ accountName: row['account_name'] });

            // 4) LOB
            lobs.push({ categoryName: row['category_name'] });

            // 5) Carrier
            carriers.push({ companyName: row['company_name'] });

            // 6) Policy Info
            policies.push({
                policyNumber: row['policy_number'],
                startDate: row['policy_start_date'],
                endDate: row['policy_end_date'],
                collectionId: row['collection_id'], // Assuming mapping
                companyCollectionId: row['company_collection_id'],
                userId: row['user_id'] // This needs to link to actual User ID presumably, but for bulk ingest raw storage:
            });
        });

        // InsertMany (Handling duplicates might be needed, for now raw insert)
        await Agent.insertMany(agents);
        await User.insertMany(users);
        await UserAccount.insertMany(accounts);
        await LOB.insertMany(lobs);
        await Carrier.insertMany(carriers);
        await Policy.insertMany(policies);

        parentPort.postMessage({ status: 'success', count: data.length });
        await mongoose.disconnect();
        process.exit(0);

    } catch (err) {
        parentPort.postMessage({ status: 'error', error: err.message });
        process.exit(1);
    }
};

processFile();
