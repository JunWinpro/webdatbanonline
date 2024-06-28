import axios from 'axios'

function generateRandomName() {
    const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Linking', 'Sinking'];
    const suffixes = ['Corp', 'Tech', 'Solutions', 'Industries', 'Labs', 'Valor', 'Waving'];

    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return randomPrefix + ' ' + randomSuffix;
}
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjdiYjNkNGMyNTVjNjMwY2M4N2YzODQiLCJlbWFpbCI6ImJha2VmZXJvY2lvdXMyQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE5Mzg3NTM3fQ.gVYULXymclQDgPgAZhzcF8YSR91ZXAMbBG68lO0ga54"

const tableList = Array.from({ length: 10 }, (_, i) => ({
    tableId: i + 1,
    isEmpty: true
}));
const schedule = Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    isWorkingDay: true,
    openTime: 7,
    closeTime: 19
}))
const create = async () => {
    const data = await axios.post('http://localhost:6000/restaurants', {
        name: generateRandomName(),
        address: {
            streetAddress: '123 Main St',
            district: 'San Francisco',
            city: 'San Francisco'
        },
        category: ['buffet', 'grill'],
        tableList,
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
    console.log(data.data)
}

const gogo = async () => {
    for (let i = 0; i < 10; i++) {
        await create()
    }
}
gogo()
// node create.js


