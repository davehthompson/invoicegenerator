export const AIRLINES = {
  DELTA: {
    name: "Delta Airlines",
    logo: "/src/assets/company-logos/Delta-Emblem.png",
    bgColor: "#00256A",
    textColor: "white",
  },
  JETBLUE: {
    name: "JetBlue Airways",
    logo: "/src/assets/company-logos/Jetblue-Logo.png",
    bgColor: "#003876",
    textColor: "white",
  },
  UNITED: {
    name: "United Airlines",
    logo: "/src/assets/company-logos/united-logo.png",
    bgColor: "#002244",
    textColor: "white",
  },
  SOUTHWEST: {
    name: "Southwest Airlines",
    logo: "/src/assets/company-logos/southwest-logo.png",
    bgColor: "#304CB2",
    textColor: "white",
  },
};

export const AIRLINE_CLASSES = {
  DELTA: {
    BASIC_ECONOMY: ["BASIC ECONOMY (E)"],
    MAIN_CABIN: ["MAIN CABIN (M)", "MAIN CABIN (K)", "MAIN CABIN (U)"],
    ECONOMY_PLUS: ["COMFORT+ (W)"],
    PREMIUM_ECONOMY: [
      "PREMIUM SELECT (P)", // International flights
    ],
    BUSINESS_FIRST: [
      "FIRST CLASS (F)", // Domestic flights
      "DELTA ONE (D)", // International flights
    ],
  },
  UNITED: {
    BASIC_ECONOMY: ["BASIC ECONOMY (N)"],
    MAIN_CABIN: ["ECONOMY (K)", "ECONOMY (M)", "ECONOMY (U)"],
    ECONOMY_PLUS: ["ECONOMY PLUS (W)"],
    PREMIUM_ECONOMY: [
      "PREMIUM PLUS (P)", // International flights
    ],
    BUSINESS_FIRST: [
      "FIRST CLASS (F)", // Domestic flights
      "POLARIS (J)", // International flights
    ],
  },
  JETBLUE: {
    BASIC_ECONOMY: ["BLUE BASIC (B)"],
    MAIN_CABIN: ["BLUE (M)"],
    ECONOMY_PLUS: ["EXTRA SPACE (W)"],
    PREMIUM_ECONOMY: ["BLUE EXTRA (E)"],
    BUSINESS_FIRST: ["MINT (J)"],
  },
  SOUTHWEST: {
    MAIN_CABIN: ["WANNA GET AWAY (K)", "WANNA GET AWAY PLUS (Y)"],
    BUSINESS_FIRST: ["BUSINESS SELECT (J)"],
  },
};
