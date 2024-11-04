// const Airtable = require('airtable');



// AIRTABLE_API_KEY='patF55CtWdPT4xLGM.cc78d8b02df5e87cf80307e305118bb1ce94b36da8a699fbb0452849ea4cd503'
// BASE_ID='appls71BBO4hL6cBx'


// // Setup Airtable base
// const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

// // Define table names
// const companiesTableName = 'Companies';
// const leadsTableName = 'Leads';
// const dataTableName = 'Data';

// async function fetchTableRecords(tableName) {
//     const records = [];
//     await base(tableName).select().eachPage((pageRecords, fetchNextPage) => {
//         records.push(...pageRecords);
//         fetchNextPage();
//     });
//     return records;
// }

// // Format address safely
// function formatAddress(address) {
//     return address && typeof address === 'string' ? address.trim() : '';
// }

// async function insertNewLead(companyName, address, contact) {
//     console.log(`Attempting to insert: Name: ${companyName}, Address: ${address}, Phone: ${contact}`);

//     // Add delay between API requests to avoid rate limiting
//     await new Promise(resolve => setTimeout(resolve, 100));

//     try {
//         await base(leadsTableName).create([
//             {
//                 fields: {
//                     'Name': companyName || '',
//                     'Address': formatAddress(address),
//                     'Phone': contact || ''
//                 }
//             }
//         ]);
//         console.log(`Successfully inserted: ${companyName}`);
//     } catch (error) {
//         console.error(`Failed to insert lead for ${companyName}: ${error.message}`);
//     }
// }

// async function run() {
//     try {
//         // Fetch all records from the Companies and Leads tables
//         const companiesRecords = await fetchTableRecords(companiesTableName);
//         const leadsRecords = await fetchTableRecords(leadsTableName);

//         // Combine companies and leads names
//         const allExistingCompanies = [
//             ...new Set([
//                 ...companiesRecords.map(record => record.get('Name')),
//                 ...leadsRecords.map(record => record.get('Name'))
//             ])
//         ];

//         // Fetch all records from the Data table
//         const dataRecords = await fetchTableRecords(dataTableName);
//         const csvData = dataRecords.map(record => ({
//             "Name": record.get('Name'),
//             "Address": record.get('Address'),
//             "Phone": record.get('Phone')
//         }));

//         // Loop through the data and insert new records if they don't exist
//         for (let company of csvData) {
//             if (!allExistingCompanies.includes(company['Name'])) {
//                 await insertNewLead(company['Name'], company['Address'], company['Phone']);
//             } else {
//                 console.log(`Skipped existing company: ${company['Name']}`);
//             }
//         }
//     } catch (error) {
//         console.error(`Error running the script: ${error.message}`);
//     }




const Airtable = require('airtable');

// API keys and Base IDs
const AIRTABLE_API_KEY_1 = 'patMPLSJ1NXS9skXe.72c023ccf1da6a5a6d7e10e85dc38910c23bf23709aa09746794df625cb10952';
const BASE_ID_1 = 'appls71BBO4hL6cBx';




//const AIRTABLE_API_KEY_2 = 'patMPLSJ1NXS9skXe.72c023ccf1da6a5a6d7e10e85dc38910c23bf23709aa09746794df625cb10952';

const AIRTABLE_API_KEY_2 = 'patL20Vtqnux4SH9o.b7e7904e1099a4d349e11e45cb42933158582e31ae987cbeab106376b8aadf41';
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

// }

// // Execute the script
// run();
