const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTest = async () => {
    try {
        console.log('--- STARTING MANUAL FLOW TEST ---');

        console.log('1. Registering Admin...');
        let adminToken;
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                name: 'Admin User',
                email: 'admin@assuvar.com',
                password: 'password123',
                phone: '1234567890',
                role: 'admin'
            });
            adminToken = regRes.data.token;
            console.log('   Admin Registered: ', regRes.data.email);
        } catch (e) {
            if (e.response && e.response.status === 400) {
                console.log('   Admin already exists, logging in...');
                const loginRes = await axios.post(`${API_URL}/auth/login`, {
                    email: 'admin@assuvar.com',
                    password: 'password123'
                });
                adminToken = loginRes.data.token;
                console.log('   Admin Logged In');
            } else {
                throw e;
            }
        }

        const config = { headers: { Authorization: `Bearer ${adminToken}` } };

        console.log('2. Creating Lead...');
        const leadRes = await axios.post(`${API_URL}/leads`, {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210',
            source: 'Referral',
            notes: 'Interested in website'
        }, config);
        const leadId = leadRes.data._id;
        console.log('   Lead Created:', leadId);

        console.log('3. Creating Quote...');
        const quoteRes = await axios.post(`${API_URL}/quotes`, {
            leadId,
            serviceDescription: 'Web Development',
            amount: 50000,
            validityDate: '2025-12-31'
        }, config);
        const quoteId = quoteRes.data._id;
        console.log('   Quote Created:', quoteId);

        console.log('4. Accepting Quote...');
        await axios.put(`${API_URL}/quotes/${quoteId}/status`, { status: 'ACCEPTED' }, config);
        console.log('   Quote Accepted');

        console.log('5. Converting to Sale...');
        const saleRes = await axios.post(`${API_URL}/sales`, {
            quoteId,
            clientReference: 'John Doe Ent.'
        }, config);
        const saleId = saleRes.data._id;
        console.log('   Sale Created:', saleId);

        console.log('6. Recording Payment (Partial)...');
        await axios.post(`${API_URL}/payments`, {
            saleId,
            amount: 20000,
            method: 'BANK_TRANSFER'
        }, config);
        console.log('   Payment Recorded');

        console.log('7. Creating Project...');
        const projectRes = await axios.post(`${API_URL}/projects`, {
            saleId,
            name: 'John Website Project'
        }, config);
        const projectId = projectRes.data._id;
        console.log('   Project Created:', projectId);

        console.log('8. Assigning Task...');
        // Create dummy employee first for assignment
        // const empRes = ... (Skip for brevity, assigning to admin or dummy ID if validation allows, but schema requires User ID. Let's register an employee)

        console.log('   (Registering Employee)...');
        const empReg = await axios.post(`${API_URL}/auth/register`, {
            name: 'Jane Dev',
            email: `jane${Date.now()}@assuvar.com`, // Unique email
            password: 'password123',
            phone: '1111111111',
            role: 'employee'
        }).catch(() => {/* Ignore if exists */ });
        // Need to get ID. If failed, login.
        let employeeId;
        if (empReg && empReg.data) employeeId = empReg.data._id;
        else {
            // Quick login to get ID if needed, or just skip if complex.
            // Actually, let's just make sure we have an ID.
            // Simplified: assign to self (Admin) just for test if allowed, or Create unique.
        }
        if (!employeeId) {
            // fetch users and pick one
            // Skip exact employee logic for this "happy path" script, just using admin ID as employee for test
            // employeeId = (await axios.post(...)).data._id;
            // Let's use the admin user ID for simplicity in this quick test script to satisfy schema
            const me = await axios.post(`${API_URL}/auth/login`, {
                email: 'admin@assuvar.com',
                password: 'password123'
            });
            employeeId = me.data._id;
        }

        const taskRes = await axios.post(`${API_URL}/projects/tasks`, {
            projectId,
            employeeId,
            name: 'Design Homepage',
            deadline: '2025-01-15',
            salary: 5000
        }, config);
        const taskId = taskRes.data._id;
        console.log('   Task Assigned:', taskId);

        console.log('9. Completing Task...');
        await axios.put(`${API_URL}/projects/tasks/${taskId}/status`, { status: 'COMPLETED' }, config);
        console.log('   Task Completed');

        console.log('10. Paying Payroll...');
        await axios.post(`${API_URL}/payroll/pay`, {
            taskId
        }, config);
        console.log('    Payroll Paid');

        console.log('--- TEST COMPLETED SUCCESSFULLY ---');

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
};

runTest();
