import axios from 'axios'

function generateRandomName() {
    const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Linking', 'Sinking'];
    const suffixes = ['Corp', 'Tech', 'Solutions', 'Industries', 'Labs', 'Valor', 'Waving'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return randomPrefix + ' ' + randomSuffix;
}
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njg4ZTlhZjJlOWY0NzFiMTAzMWVkYTkiLCJlbWFpbCI6ImJha2VmZXJvY2lvdXMyQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzIwMjUxMjQ2LCJleHAiOjE3MjAyNTQ4NDZ9.QngKI1Ossz_9cFuaPv0rJl5l4KI9GhNI9Lk4kpcpXCA"

const schedule = Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    isWorkingDay: i === 6 ? false : true,
    openTime: 8,
    closeTime: 21
}))
const create = async () => {
    try {
        await axios.post('http://localhost:8000/restaurants', {
            name: generateRandomName(),
            address: {
                streetAddress: '123 Main St',
                district: 'San Francisco',
                city: 'San Francisco'
            },
            category: ['buffet', 'grill'],
            totalTable: Math.floor(Math.random() * 100),
            description: [
                {
                    title: 'Description 1',
                    content: 'Description 1 content'
                }
            ],
            schedule
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }
    catch (err) {
        console.log(err.message);
    }
}

const gogo = async () => {
    try {
        for (let i = 0; i < 10; i++) {
            await create()
        }
    }
    catch (err) {
        console.log(err.message);
    }
}
gogo()
// node create.js


