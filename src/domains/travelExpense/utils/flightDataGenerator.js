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
        ECONOMY: [
            'BASIC ECONOMY (E)',
            'MAIN CABIN (M)',
            'ECONOMY (K)',
            'FLEXIBLE ECONOMY (Y)'
        ],
        PREMIUM: [
            'COMFORT+ (W)',
            'PREMIUM SELECT (P)'
        ],
        BUSINESS: [
            'FIRST CLASS (F)',
            'DELTA ONE (D)',
            'BUSINESS (J)'
        ]
    },
    UNITED: {
        ECONOMY: [
            'BASIC ECONOMY (N)',
            'ECONOMY (K)',
            'UNITED ECONOMY (U)',
            'FLEXIBLE ECONOMY (Y)'
        ],
        PREMIUM: [
            'ECONOMY PLUS (W)',
            'PREMIUM PLUS (P)'
        ],
        BUSINESS: [
            'UNITED FIRST (F)',
            'UNITED POLARIS (J)',
            'BUSINESS (C)'
        ]
    },
    JETBLUE: {
        ECONOMY: [
            'BLUE BASIC (B)',
            'BLUE (M)',
            'BLUE EXTRA (K)',
            'FLEXIBLE (Y)'
        ],
        PREMIUM: [
            'EVEN MORE SPACE (W)'
        ],
        BUSINESS: [
            'MINT (J)',
            'MINT STUDIO (C)'
        ]
    },
    SOUTHWEST: {
        ECONOMY: [
            'WANNA GET AWAY (N)',
            'WANNA GET AWAY PLUS (K)',
            'ANYTIME (Y)'
        ],
        PREMIUM: [],  // Southwest doesn't have premium economy
        BUSINESS: [
            'BUSINESS SELECT (J)'
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
    let classTypes;
    const rand = Math.random();
    
    if (flightType === 'LONG') {
        if (rand < 0.4) classTypes = airlineClasses.BUSINESS;
        else if (rand < 0.7 && airlineClasses.PREMIUM.length > 0) classTypes = airlineClasses.PREMIUM;
        else classTypes = airlineClasses.ECONOMY;
    } else if (flightType === 'MEDIUM') {
        if (rand < 0.3) classTypes = airlineClasses.BUSINESS;
        else if (rand < 0.6 && airlineClasses.PREMIUM.length > 0) classTypes = airlineClasses.PREMIUM;
        else classTypes = airlineClasses.ECONOMY;
    } else {
        if (rand < 0.2) classTypes = airlineClasses.BUSINESS;
        else if (rand < 0.4 && airlineClasses.PREMIUM.length > 0) classTypes = airlineClasses.PREMIUM;
        else classTypes = airlineClasses.ECONOMY;
    }

    return classTypes[Math.floor(Math.random() * classTypes.length)];
};

const generateAmount = (flightType, bookingClass) => {
    const baseAmounts = {
        SHORT: { min: 99, max: 299 },
        MEDIUM: { min: 199, max: 499 },
        LONG: { min: 399, max: 899 }
    };

    let multiplier = 1;
    if (bookingClass.includes('PREMIUM') || bookingClass.includes('PLUS') || bookingClass.includes('COMFORT') || bookingClass.includes('SPACE')) {
        multiplier = 1.8;
    } else if (bookingClass.includes('BUSINESS') || bookingClass.includes('FIRST') || bookingClass.includes('ONE') || bookingClass.includes('MINT') || bookingClass.includes('POLARIS')) {
        multiplier = 2.5;
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