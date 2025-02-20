import { AIRLINE_CLASSES } from "./airlineConfig";
import { addHours, addMinutes } from "date-fns";

const FLIGHT_ROUTES = {
  SHORT: [
    // Flights under 2 hours
    { origin: "ATL", destination: "MIA", duration: 100 }, // 1h 40m
    { origin: "LAX", destination: "LAS", duration: 65 }, // 1h 05m
    { origin: "BOS", destination: "JFK", duration: 60 }, // 1h
    { origin: "DFW", destination: "HOU", duration: 70 }, // 1h 10m
  ],
  MEDIUM: [
    // Flights 2-4 hours
    { origin: "JFK", destination: "ORD", duration: 150 }, // 2h 30m
    { origin: "ATL", destination: "DFW", duration: 135 }, // 2h 15m
    { origin: "LAX", destination: "DEN", duration: 145 }, // 2h 25m
    { origin: "SEA", destination: "SFO", duration: 130 }, // 2h 10m
  ],
  LONG: [
    // Flights 4+ hours
    { origin: "JFK", destination: "LAX", duration: 360 }, // 6h
    { origin: "MIA", destination: "SEA", duration: 360 }, // 6h
    { origin: "BOS", destination: "SFO", duration: 330 }, // 5h 30m
    { origin: "ATL", destination: "LAS", duration: 270 }, // 4h 30m
  ],
};

const generateFlightNumber = (airline) => {
  const prefixes = {
    DELTA: "DL",
    UNITED: "UA",
    JETBLUE: "B6",
    SOUTHWEST: "WN",
  };
  const number = Math.floor(Math.random() * 3000) + 1000;
  return `${prefixes[airline]}${number}`;
};

const generateReferenceNumber = (airline) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let ref = "";

  // Airline-specific reference number formats
  switch (airline) {
    case "DELTA":
      ref = "DL";
      break;
    case "UNITED":
      ref = "UA";
      break;
    case "JETBLUE":
      ref = "JB";
      break;
    case "SOUTHWEST":
      ref = "WN";
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

  if (flightType === "LONG") {
    // Long flights have higher chances of premium cabins
    if (rand < 0.15) {
      classPool = airlineClasses.BUSINESS_FIRST;
    } else if (rand < 0.3 && airlineClasses.PREMIUM_ECONOMY.length > 0) {
      classPool = airlineClasses.PREMIUM_ECONOMY;
    } else if (rand < 0.5) {
      classPool = airlineClasses.ECONOMY_PLUS;
    } else if (rand < 0.8) {
      classPool = airlineClasses.MAIN_CABIN;
    } else {
      classPool = airlineClasses.BASIC_ECONOMY;
    }
  } else if (flightType === "MEDIUM") {
    // Medium flights have moderate chances of premium cabins
    if (rand < 0.1) {
      classPool = airlineClasses.BUSINESS_FIRST;
    } else if (rand < 0.3) {
      classPool = airlineClasses.ECONOMY_PLUS;
    } else if (rand < 0.7) {
      classPool = airlineClasses.MAIN_CABIN;
    } else {
      classPool = airlineClasses.BASIC_ECONOMY;
    }
  } else {
    // Short flights mostly economy with some first class
    if (rand < 0.05) {
      classPool = airlineClasses.BUSINESS_FIRST;
    } else if (rand < 0.2) {
      classPool = airlineClasses.ECONOMY_PLUS;
    } else if (rand < 0.7) {
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

// Base price multipliers for different cabin classes
const CLASS_MULTIPLIERS = {
  "BASIC ECONOMY": 1,
  "MAIN CABIN": 1.3,
  "ECONOMY PLUS": 1.5,
  "PREMIUM ECONOMY": 2,
  "COMFORT+": 1.5,
  "PREMIUM SELECT": 2,
  "FIRST CLASS": 3,
  "BUSINESS SELECT": 2.5,
  "DELTA ONE": 4,
  POLARIS: 4,
  MINT: 3.5,
};

// Base prices for routes (one-way) in basic economy
const ROUTE_BASE_PRICES = {
  "LAX-JFK": { base: 199, peak: 399 }, // Transcontinental
  "JFK-LAX": { base: 199, peak: 399 }, // Transcontinental
  "LAX-DEN": { base: 119, peak: 249 }, // Mid-distance
  "DEN-LAX": { base: 119, peak: 249 }, // Mid-distance
  "JFK-DEN": { base: 159, peak: 329 }, // Mid-distance
  "DEN-JFK": { base: 159, peak: 329 }, // Mid-distance
};

export const generateFlightData = () => {
  // Select a random airline
  const airlines = Object.keys(AIRLINE_CLASSES);
  const selectedAirline = airlines[Math.floor(Math.random() * airlines.length)];

  // Get booking classes for selected airline and choose one randomly
  const getRandomBookingClass = (airline) => {
    const classes = AIRLINE_CLASSES[airline];
    const allClasses = [
      ...(classes.BASIC_ECONOMY || []),
      ...(classes.MAIN_CABIN || []),
      ...(classes.ECONOMY_PLUS || []),
      ...(classes.PREMIUM_ECONOMY || []),
      ...(classes.BUSINESS_FIRST || []),
    ];
    return allClasses[Math.floor(Math.random() * allClasses.length)];
  };

  // Generate random departure date within next 30 days
  const generateDepartureDate = () => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + Math.floor(Math.random() * 30));

    // Set random hour between 6 AM and 10 PM
    futureDate.setHours(6 + Math.floor(Math.random() * 16));
    futureDate.setMinutes(Math.floor(Math.random() * 60));

    return futureDate;
  };

  // Generate arrival date based on route
  const generateArrivalDate = (departureDate, origin, destination) => {
    // Define common routes and their approximate flight times (in minutes)
    const routeDurations = {
      "LAX-JFK": { min: 300, max: 330 }, // 5-5.5 hours
      "LAX-DEN": { min: 120, max: 150 }, // 2-2.5 hours
      "JFK-LAX": { min: 330, max: 360 }, // 5.5-6 hours
      "JFK-DEN": { min: 240, max: 270 }, // 4-4.5 hours
      "DEN-LAX": { min: 150, max: 180 }, // 2.5-3 hours
      "DEN-JFK": { min: 210, max: 240 }, // 3.5-4 hours
    };

    const route = `${origin}-${destination}`;
    const duration = routeDurations[route] || { min: 180, max: 240 }; // default 3-4 hours

    // Random duration within range
    const flightMinutes =
      duration.min + Math.floor(Math.random() * (duration.max - duration.min));

    return addMinutes(departureDate, flightMinutes);
  };

  // Common airport codes
  const airports = ["LAX", "JFK", "DEN"];
  const origin = airports[Math.floor(Math.random() * airports.length)];
  let destination;
  do {
    destination = airports[Math.floor(Math.random() * airports.length)];
  } while (destination === origin); // Ensure destination is different from origin

  // Generate flight number
  const flightNumber = `${selectedAirline.substring(0, 2)}${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  // Generate random reference number
  const referenceNumber = `${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  const calculatePrice = (origin, destination, bookingClass) => {
    const route = `${origin}-${destination}`;
    const routePricing = ROUTE_BASE_PRICES[route] || { base: 149, peak: 299 };

    // Determine if it's peak pricing (random for demo)
    const isPeak = Math.random() > 0.5;
    const basePrice = isPeak ? routePricing.peak : routePricing.base;

    // Get multiplier based on booking class
    let multiplier = 1;
    for (const [classType, mult] of Object.entries(CLASS_MULTIPLIERS)) {
      if (bookingClass.includes(classType)) {
        multiplier = mult;
        break;
      }
    }

    // Add some random variation (±10%)
    const variation = 0.9 + Math.random() * 0.2;

    // Calculate final price
    const finalPrice = basePrice * multiplier * variation;

    return Math.round(finalPrice);
  };

  const departureDate = generateDepartureDate();
  const bookingClass = getRandomBookingClass(selectedAirline);
  const totalAmount = calculatePrice(origin, destination, bookingClass);

  return {
    airline: selectedAirline,
    referenceNumber,
    flightNumber,
    origin,
    destination,
    departureDate,
    arrivalDate: generateArrivalDate(departureDate, origin, destination),
    bookingClass,
    totalAmount: totalAmount.toFixed(2),
  };
};
