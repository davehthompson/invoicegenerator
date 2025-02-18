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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Generate Demo Data
        </button>
    );
};

export default DemoTravelDataButton; 