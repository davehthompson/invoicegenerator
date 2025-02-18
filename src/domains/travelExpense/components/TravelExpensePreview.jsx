import React from 'react';
import { format } from 'date-fns';
import { AIRLINES } from '../utils/airlineConfig';

const TravelExpensePreview = ({ formData, expenseType }) => {
    if (!formData) return null;

    const airlineConfig = AIRLINES[formData.airline || 'DELTA'];

    const formatDate = (date) => {
        return date ? format(new Date(date), 'EEE, MMM d, yyyy').toUpperCase() : '';
    };

    const formatTime = (date) => {
        return date ? format(new Date(date), 'h:mm a').toLowerCase() : '';
    };

    const renderAirlinePreview = () => (
        <div id="preview-content" className="max-w-2xl mx-auto bg-white text-gray-800 rounded-lg overflow-hidden">
            {/* Header with Airline Logo */}
            <div style={{ backgroundColor: airlineConfig.bgColor }} className="p-6">
                <div className="flex justify-between items-center">
                    <div className="w-32">
                        <img 
                            src={airlineConfig.logo} 
                            alt={airlineConfig.name}
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="text-white text-right">
                        <div className="text-sm">Confirmation #</div>
                        <div className="text-xl font-bold">{formData.referenceNumber}</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Trip Overview */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">Your Trip to {formData.destination}</h2>
                    <p className="text-gray-600">{formatDate(formData.departureDate)}</p>
                </div>

                {/* Flight Details Card */}
                <div className="border rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">
                            {airlineConfig.name} Flight {formData.flightNumber}
                        </div>
                        <div className="text-sm font-medium">
                            {formData.bookingClass}
                        </div>
                    </div>

                    {/* Flight Route */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-center flex-1">
                            <div className="text-2xl font-bold">{formData.origin}</div>
                            <div className="text-sm text-gray-600">{formatTime(formData.departureDate)}</div>
                            <div className="text-xs text-gray-500">{formatDate(formData.departureDate)}</div>
                        </div>
                        
                        <div className="flex-1 px-4">
                            <div className="relative">
                                <div className="border-t-2 border-gray-300 w-full absolute top-1/2"></div>
                                <div className="flex justify-center">
                                    <svg className="w-6 h-6 text-gray-400 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="text-center flex-1">
                            <div className="text-2xl font-bold">{formData.destination}</div>
                            <div className="text-sm text-gray-600">{formatTime(formData.arrivalDate)}</div>
                            <div className="text-xs text-gray-500">{formatDate(formData.arrivalDate)}</div>
                        </div>
                    </div>
                </div>

                {/* Fare Summary */}
                <div className="border-t pt-4">
                    <h3 className="text-lg font-bold mb-4">Fare Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Ticket Price</span>
                            <span>${(parseFloat(formData.totalAmount) * 0.85).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Taxes & Fees</span>
                            <span>${(parseFloat(formData.totalAmount) * 0.15).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total</span>
                            <span>${formData.totalAmount}</span>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-6 text-sm text-gray-600">
                    <div className="mb-4">
                        <h4 className="font-bold text-gray-800 mb-2">Important Information</h4>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Please arrive at the airport at least 2 hours before your flight</li>
                            <li>Don't forget to bring a valid form of identification</li>
                            <li>Check current travel requirements and restrictions</li>
                        </ul>
                    </div>
                    <div className="text-xs text-gray-500">
                        This is your flight confirmation and receipt. You can use this for your records.
                    </div>
                </div>
            </div>
        </div>
    );

    const renderHotelPreview = () => (
        <div className="p-6 rounded-lg">
            <h2>Hotel Preview Coming Soon</h2>
        </div>
    );

    return (
        <div className="shadow-lg">
            {expenseType === 'AIRLINE' ? renderAirlinePreview() : renderHotelPreview()}
        </div>
    );
};

export default TravelExpensePreview; 