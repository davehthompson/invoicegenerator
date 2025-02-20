import React from 'react';
import { SAMPLE_HOTEL_FOLIOS, SAMPLE_AIRLINE_RESERVATIONS } from '../utils/generateFakeTravelData';

const DemoTravelDataButton = () => {
    const handleGenerateDemo = () => {
        console.log('Hotel Folios:', SAMPLE_HOTEL_FOLIOS);
        console.log('Airline Reservations:', SAMPLE_AIRLINE_RESERVATIONS);
        // You can add more functionality here to populate your form
    };

    return (
        <button
            onClick={handleGenerateDemo}
            className="flex items-center gap-2 px-4 py-2 bg-[#E4F222] border border-[#E4F222] text-gray-800 hover:bg-[#cdd71f] hover:border-[#cdd71f] focus:outline-none focus:ring-2 focus:ring-[#E4F222] focus:ring-opacity-50 transition-colors"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                <path d="M3 5c0 1.657 3.134 3 7 3s7-1.343 7-3-3.134-3-7-3-7 1.343-7 3z" />
            </svg>
            Generate Demo Data
        </button>
    );
};

export default DemoTravelDataButton; 