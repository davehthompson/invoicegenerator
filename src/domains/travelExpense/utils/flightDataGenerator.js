const FLIGHT_ROUTES = {
    SHORT: [ // Flights under 2 hours
        { origin: 'ATL', destination: 'MIA', duration: 100 }, // 1h 40m
        { origin: 'LAX', destination: 'LAS', duration: 65 }, // 1h 05m
        { origin: 'BOS', destination: 'JFK', duration: 60 }, // 1h
        { origin: 'DFW', destination: 'HOU', duration: 70 }, // 1h 10m
    ],
    MEDIUM: [ // Flights 2-4 hours
        { origin: 'JFK', destination: 'ORD', duration: 150 }, // 2h 30m
        { origin: 'ATL', destination: 'DFW', duration: 135 }, // 2h 15m
        { origin: 'LAX', destination: 'DEN', duration: 145 }, // 2h 25m
        { origin: 'SEA', destination: 'SFO', duration: 130 }, // 2h 10m
    ],
    LONG: [ // Flights 4+ hours
        { origin: 'JFK', destination: 'LAX', duration: 360 }, // 6h
        { origin: 'MIA', destination: 'SEA', duration: 360 }, // 6h
        { origin: 'BOS', destination: 'SFO', duration: 330 }, // 5h 30m
        { origin: 'ATL', destination: 'LAS', duration: 270 }, // 4h 30m
    ]
};

const AIRLINE_CLASSES = {
    DELTA: {
        BASIC_ECONOMY: [
            'BASIC ECONOMY (E)',
        ],
        MAIN_CABIN: [
            'MAIN CABIN (M)',
            'MAIN CABIN (K)',
            'MAIN CABIN (U)',
        ],
        ECONOMY_PLUS: [
            'COMFORT+ (W)',
        ],
        PREMIUM_ECONOMY: [
            'PREMIUM SELECT (P)',  // International flights
        ],
        BUSINESS_FIRST: [
            'FIRST CLASS (F)',     // Domestic flights
            'DELTA ONE (D)',       // International flights
        ]
    },
    UNITED: {
        BASIC_ECONOMY: [
            'BASIC ECONOMY (N)',
        ],
        MAIN_CABIN: [
            'ECONOMY (K)',
            'ECONOMY (M)',
            'ECONOMY (U)',
        ],
        ECONOMY_PLUS: [
            'ECONOMY PLUS (W)',
        ],
        PREMIUM_ECONOMY: [
            'PREMIUM PLUS (P)',    // International flights
        ],
        BUSINESS_FIRST: [
            'FIRST CLASS (F)',     // Domestic flights
            'POLARIS (J)',         // International flights
        ]
    },
    AMERICAN: {
        BASIC_ECONOMY: [
            'BASIC ECONOMY (B)',
        ],
        MAIN_CABIN: [
            'MAIN CABIN (M)',
            'MAIN CABIN (H)',
            'MAIN CABIN (K)',
        ],
        ECONOMY_PLUS: [
            'MAIN CABIN EXTRA (W)',
        ],
        PREMIUM_ECONOMY: [
            'PREMIUM ECONOMY (P)', // International flights
        ],
        BUSINESS_FIRST: [
            'FIRST CLASS (F)',     // Domestic flights
            'BUSINESS (J)',        // International flights
            'FLAGSHIP FIRST (F)',  // Premium international routes
        ]
    },
    JETBLUE: {
        BASIC_ECONOMY: [
            'BLUE BASIC (B)',
        ],
        MAIN_CABIN: [
            'BLUE (M)',
        ],
        ECONOMY_PLUS: [
            'EVEN MORE SPACE (W)',
        ],
        PREMIUM_ECONOMY: [],       // JetBlue doesn't offer Premium Economy
        BUSINESS_FIRST: [
            'MINT (J)',
            'MINT STUDIO (C)',     // Enhanced Mint experience
        ]
    }
};

const generateFlightNumber = (airline) => {
    const prefixes = {
        DELTA: 'DL',
        UNITED: 'UA',
        JETBLUE: 'B6',
        SOUTHWEST: 'WN'
    };
    const number = Math.floor(Math.random() * 3000) + 1000;
    return `${prefixes[airline]}${number}`;
};

const generateReferenceNumber = (airline) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let ref = '';
    
    // Airline-specific reference number formats
    switch(airline) {
        case 'DELTA':
            ref = 'DL';
            break;
        case 'UNITED':
            ref = 'UA';
            break;
        case 'JETBLUE':
            ref = 'JB';
            break;
        case 'SOUTHWEST':
            ref = 'WN';
            break;
    }
    
    for (let i = 0; i < 4; i++) {
        ref += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return ref;
};

const generateBookingClass = (airline, flightType) => {
    const airlineClasses = AIRLINE_CLASSES[airline];
    let classPool;
    const rand = Math.random();

    if (flightType === 'LONG') {
        // Long flights have higher chances of premium cabins
        if (rand < 0.15) {
            classPool = airlineClasses.BUSINESS_FIRST;
        } else if (rand < 0.30 && airlineClasses.PREMIUM_ECONOMY.length > 0) {
            classPool = airlineClasses.PREMIUM_ECONOMY;
        } else if (rand < 0.50) {
            classPool = airlineClasses.ECONOMY_PLUS;
        } else if (rand < 0.80) {
            classPool = airlineClasses.MAIN_CABIN;
        } else {
            classPool = airlineClasses.BASIC_ECONOMY;
        }
    } else if (flightType === 'MEDIUM') {
        // Medium flights have moderate chances of premium cabins
        if (rand < 0.10) {
            classPool = airlineClasses.BUSINESS_FIRST;
        } else if (rand < 0.30) {
            classPool = airlineClasses.ECONOMY_PLUS;
        } else if (rand < 0.70) {
            classPool = airlineClasses.MAIN_CABIN;
        } else {
            classPool = airlineClasses.BASIC_ECONOMY;
        }
    } else {
        // Short flights mostly economy with some first class
        if (rand < 0.05) {
            classPool = airlineClasses.BUSINESS_FIRST;
        } else if (rand < 0.20) {
            classPool = airlineClasses.ECONOMY_PLUS;
        } else if (rand < 0.70) {
            classPool = airlineClasses.MAIN_CABIN;
        } else {
            classPool = airlineClasses.BASIC_ECONOMY;
        }
    }

    // If selected class pool is empty (like JetBlue Premium Economy), fall back to Main Cabin
    if (classPool.length === 0) {
        classPool = airlineClasses.MAIN_CABIN;
    }

    return classPool[Math.floor(Math.random() * classPool.length)];
};

const generateAmount = (flightType, bookingClass) => {
    const baseAmounts = {
        SHORT: { min: 99, max: 299 },
        MEDIUM: { min: 199, max: 499 },
        LONG: { min: 399, max: 899 }
    };

    let multiplier = 1;
    // Adjust price based on cabin class
    if (bookingClass.includes('BASIC')) {
        multiplier = 0.8;
    } else if (bookingClass.includes('COMFORT+') || bookingClass.includes('ECONOMY PLUS') || 
               bookingClass.includes('MAIN CABIN EXTRA') || bookingClass.includes('EVEN MORE SPACE')) {
        multiplier = 1.3;
    } else if (bookingClass.includes('PREMIUM')) {
        multiplier = 1.8;
    } else if (bookingClass.includes('FIRST') || bookingClass.includes('ONE') || 
               bookingClass.includes('POLARIS') || bookingClass.includes('MINT')) {
        multiplier = 2.5;
    } else if (bookingClass.includes('FLAGSHIP')) {
        multiplier = 3.0;
    }

    const range = baseAmounts[flightType];
    return (Math.random() * (range.max - range.min) + range.min * multiplier).toFixed(2);
};

export const generateFlightData = () => {
    const airlines = ['DELTA', 'UNITED', 'JETBLUE', 'SOUTHWEST'];
    const selectedAirline = airlines[Math.floor(Math.random() * airlines.length)];
    
    const flightTypes = ['SHORT', 'MEDIUM', 'LONG'];
    const selectedType = flightTypes[Math.floor(Math.random() * flightTypes.length)];
    
    const routes = FLIGHT_ROUTES[selectedType];
    const selectedRoute = routes[Math.floor(Math.random() * routes.length)];
    
    const departureDate = new Date();
    departureDate.setHours(6 + Math.floor(Math.random() * 14), Math.floor(Math.random() * 60));
    
    const arrivalDate = new Date(departureDate.getTime() + selectedRoute.duration * 60000);

    const bookingClass = generateBookingClass(selectedAirline, selectedType);

    return {
        airline: selectedAirline,
        referenceNumber: generateReferenceNumber(selectedAirline),
        flightNumber: generateFlightNumber(selectedAirline),
        origin: selectedRoute.origin,
        destination: selectedRoute.destination,
        departureDate: departureDate,
        arrivalDate: arrivalDate,
        bookingClass: bookingClass,
        totalAmount: generateAmount(selectedType, bookingClass)
    };
}; 