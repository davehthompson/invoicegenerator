import React from 'react';
import { format } from 'date-fns';
import { AIRLINES } from '../utils/airlineConfig';

const TravelExpensePreview = ({ formData, expenseType }) => {
    if (!formData) return null;

    const airlineConfig = AIRLINES[formData.airline || 'DELTA'];

    const formatDate = (date) => {
        return date ? format(new Date(date), 'EEE, ddMMM').toUpperCase() : '';
    };

    const formatTime = (date) => {
        return date ? format(new Date(date), 'h:mmaaa').toLowerCase() : '';
    };

    const renderHotelPreview = () => (
        <div className="p-6 rounded-lg">
            <h2>Hotel Preview Coming Soon</h2>
        </div>
    );

    const renderAirlinePreview = () => (
        <div style={{ backgroundColor: airlineConfig.bgColor }} className="text-white p-6 rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="w-32">
                    <img 
                        src={airlineConfig.logo} 
                        alt={airlineConfig.name}
                        className="w-full h-auto"
                    />
                </div>
                <div className="text-right">
                    <div>Your Trip Confirmation #:</div>
                    <div>{formData.referenceNumber}</div>
                </div>
            </div>

            {/* Award Receipt */}
            <div className="bg-white text-black p-4 rounded mb-4">
                <h2 className="text-xl mb-4">Award Receipt</h2>

                {/* Flight Details Table */}
                <div className="bg-gray-200 p-4 rounded">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="font-bold">{formatDate(formData.departureDate)}</div>
                            <div className="text-sm mt-2">
                                {airlineConfig.name.split(' ')[0].toUpperCase()} {formData.flightNumber}
                                <div className="font-bold">{formData.bookingClass}</div>
                            </div>
                        </div>
                        <div>
                            <div className="font-bold">DEPART</div>
                            <div className="mt-2">
                                <div>{formData.origin}</div>
                                <div>{formatTime(formData.departureDate)}</div>
                            </div>
                        </div>
                        <div>
                            <div className="font-bold">ARRIVE</div>
                            <div className="mt-2">
                                <div>{formData.destination}</div>
                                <div>{formatTime(formData.arrivalDate)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Charges */}
                <div className="mt-6">
                    <div className="font-bold">Total Charges</div>
                    <div className="flex justify-between items-center mt-2 border-t pt-2">
                        <div className="font-bold">TOTAL TICKET VALUE</div>
                        <div className="font-bold">${formData.totalAmount} USD</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="shadow-lg">
            {expenseType === 'AIRLINE' ? renderAirlinePreview() : renderHotelPreview()}
        </div>
    );
};

export default TravelExpensePreview; 