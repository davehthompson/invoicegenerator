import React, { useMemo, useEffect, useCallback } from 'react';
import { useTopBar } from '../../shared/context/TopBarContext';
import TravelExpensePreview from './TravelExpensePreview';
import { useTravelExpenseForm } from '../hooks/useTravelExpenseForm';
import DatePicker from 'react-datepicker';
import { AIRLINES } from '../utils/airlineConfig';
import "react-datepicker/dist/react-datepicker.css";

const TravelExpenseContent = () => {
    const { setActions } = useTopBar();
    const {
        formData,
        expenseType,
        handleInputChange,
        handleDateChange,
        handleExpenseTypeChange,
        handleAirlineChange,
        loadDemoData
    } = useTravelExpenseForm();

    // Memoize the loadDemoData callback
    const handleLoadDemoData = useCallback(() => {
        loadDemoData();
    }, [loadDemoData]);

    // Create actions element only once
    const actionButtons = useMemo(() => (
        <div className="flex gap-2">
            <button
                className="flex items-center gap-2 px-4 py-2 bg-[#E4F222] border border-[#E4F222] text-gray-800 hover:bg-[#cdd71f] hover:border-[#cdd71f] focus:outline-none focus:ring-2 focus:ring-[#E4F222] focus:ring-opacity-50 transition-colors"
                onClick={handleLoadDemoData}
            >
                Load Demo Data
            </button>
            <button
                className="flex items-center gap-2 px-4 py-2 bg-[#E4F222] border border-[#E4F222] text-gray-800 hover:bg-[#cdd71f] hover:border-[#cdd71f] focus:outline-none focus:ring-2 focus:ring-[#E4F222] focus:ring-opacity-50 transition-colors"
                onClick={() => console.log('Generate PDF')}
            >
                Generate PDF
            </button>
        </div>
    ), []); // Empty dependency array since buttons don't depend on changing values

    useEffect(() => {
        setActions(actionButtons);
        return () => setActions(null);
    }, [setActions, actionButtons]);

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Form Section */}
            <div className="w-1/2 p-8 overflow-auto">
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900">Travel Expense Generator</h1>
                    
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                        <div className="px-4 py-6 sm:p-8">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8">
                                <div className="col-span-full">
                                    <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                                        Expense Type
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="type"
                                            name="type"
                                            value={expenseType}
                                            onChange={(e) => handleExpenseTypeChange(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#E4F222] sm:text-sm sm:leading-6"
                                        >
                                            <option value="HOTEL">Hotel Folio</option>
                                            <option value="AIRLINE">Airline Reservation</option>
                                        </select>
                                    </div>
                                </div>

                                {expenseType === 'AIRLINE' && (
                                    <>
                                        <div className="col-span-full">
                                            <label htmlFor="airline" className="block text-sm font-medium leading-6 text-gray-900">
                                                Select Airline
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    id="airline"
                                                    name="airline"
                                                    value={formData.airline}
                                                    onChange={(e) => handleAirlineChange(e.target.value)}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#E4F222] sm:text-sm sm:leading-6"
                                                >
                                                    {Object.entries(AIRLINES).map(([key, value]) => (
                                                        <option key={key} value={key}>
                                                            {value.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="referenceNumber" className="block text-sm font-medium leading-6 text-gray-900">
                                                Reference Number
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="referenceNumber"
                                                    id="referenceNumber"
                                                    value={formData.referenceNumber}
                                                    onChange={handleInputChange}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#E4F222] sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="flightNumber" className="block text-sm font-medium leading-6 text-gray-900">
                                                Flight Number
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="flightNumber"
                                                    id="flightNumber"
                                                    value={formData.flightNumber}
                                                    onChange={handleInputChange}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#E4F222] sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="origin" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Origin
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        name="origin"
                                                        id="origin"
                                                        value={formData.origin}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#E4F222] sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="destination" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Destination
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        name="destination"
                                                        id="destination"
                                                        value={formData.destination}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#E4F222] sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="departureDate" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Departure Date & Time
                                                </label>
                                                <div className="mt-2">
                                                    <DatePicker
                                                        selected={formData.departureDate}
                                                        onChange={(date) => handleDateChange(date, 'departureDate')}
                                                        showTimeSelect
                                                        dateFormat="MMM d, yyyy h:mm aa"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#E4F222] sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="arrivalDate" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Arrival Date & Time
                                                </label>
                                                <div className="mt-2">
                                                    <DatePicker
                                                        selected={formData.arrivalDate}
                                                        onChange={(date) => handleDateChange(date, 'arrivalDate')}
                                                        showTimeSelect
                                                        dateFormat="MMM d, yyyy h:mm aa"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#E4F222] sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="bookingClass" className="block text-sm font-medium leading-6 text-gray-900">
                                                Booking Class
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="bookingClass"
                                                    id="bookingClass"
                                                    value={formData.bookingClass}
                                                    onChange={handleInputChange}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#E4F222] sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="totalAmount" className="block text-sm font-medium leading-6 text-gray-900">
                                                Total Amount (USD)
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="totalAmount"
                                                    id="totalAmount"
                                                    value={formData.totalAmount}
                                                    onChange={handleInputChange}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#E4F222] sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="w-1/2 bg-gray-50 p-8 overflow-auto border-l border-gray-200">
                <div className="sticky top-0">
                    <TravelExpensePreview 
                        formData={formData}
                        expenseType={expenseType}
                    />
                </div>
            </div>
        </div>
    );
};

export default TravelExpenseContent; 