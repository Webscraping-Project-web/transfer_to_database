const Airtable = require('airtable');

// API keys and Base IDs
const AIRTABLE_API_KEY_1 = 'patMPLSJ1NXS9skXe.72c023ccf1da6a5a6d7e10e85dc38910c23bf23709aa09746794df625cb10952';
const BASE_ID_1 = 'appls71BBO4hL6cBx';



// const AIRTABLE_API_KEY_2 = 'patMWzgz69bGhSecM.2c531bfa85230ce43b33fc2bcfc9d1bd3ac90c3139594ba338574a00f3b4f09d';
// const BASE_ID_2 = 'appYqSx4l5TlghInj';

const AIRTABLE_API_KEY_2 = 'patMPLSJ1NXS9skXe.72c023ccf1da6a5a6d7e10e85dc38910c23bf23709aa09746794df625cb10952';
const BASE_ID_2 = 'apphw7rTx5kMq9zQR';

// Setup Airtable bases
const dataBase = new Airtable({ apiKey: AIRTABLE_API_KEY_1 }).base(BASE_ID_1);
const companiesLeadsBase = new Airtable({ apiKey: AIRTABLE_API_KEY_2 }).base(BASE_ID_2);

// Define table names
const companiesTableName = 'Companies';
const leadsTableName = 'Leads';
const dataTableName = 'Data';

async function fetchTableRecords(base, tableName) {
    const records = [];
    await base(tableName).select().eachPage((pageRecords, fetchNextPage) => {
        records.push(...pageRecords);
        fetchNextPage();
    });
    return records;
}

// Format address safely
function formatAddress(address) {
    return address && typeof address === 'string' ? address.trim() : '';
}

async function insertNewLead(companyName, address, contact) {
    console.log(`Attempting to insert: Name: ${companyName}, Address: ${address}, Phone: ${contact}`);

    // Add delay between API requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        await companiesLeadsBase(leadsTableName).create([
            {
                fields: {
                    'Name': companyName || '',
                    'Address': formatAddress(address),
                    'Phone': contact || ''
                }
            }
        ]);
        console.log(`Successfully inserted: ${companyName}`);
    } catch (error) {
        console.error(`Failed to insert lead for ${companyName}: ${error.message}`);
    }
}

async function run() {
    try {
        // Fetch all records from the Companies and Leads tables in the second base
        const companiesRecords = await fetchTableRecords(companiesLeadsBase, companiesTableName);
        const leadsRecords = await fetchTableRecords(companiesLeadsBase, leadsTableName);

        // Combine companies and leads names
        const allExistingCompanies = [
            ...new Set([
                ...companiesRecords.map(record => record.get('Name')),
                ...leadsRecords.map(record => record.get('Name'))
            ])
        ];

        // Fetch all records from the Data table in the first base
        const dataRecords = await fetchTableRecords(dataBase, dataTableName);
        const csvData = dataRecords.map(record => ({
            "Name": record.get('Name'),
            "Address": record.get('Address'),
            "Phone": record.get('Phone')
        }));

        // Loop through the data and insert new records if they don't exist
        for (let company of csvData) {
            if (!allExistingCompanies.includes(company['Name'])) {
                await insertNewLead(company['Name'], company['Address'], company['Phone']);
            } else {
                console.log(`Skipped existing company: ${company['Name']}`);
            }
        }
    } catch (error) {
        console.error(`Error running the script: ${error.message}`);
    }
}

// Execute the script
run();
