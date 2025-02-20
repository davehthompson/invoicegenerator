import React, { useMemo, useEffect, useCallback } from 'react';
import { useTopBar } from '../../shared/context/TopBarContext';
import TravelExpensePreview from './TravelExpensePreview';
import { useTravelExpenseForm } from '../hooks/useTravelExpenseForm';
import DatePicker from 'react-datepicker';
import { AIRLINES } from '../utils/airlineConfig';
import "react-datepicker/dist/react-datepicker.css";
import { generatePDF } from '../utils/pdfGenerator';

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

    const handleGeneratePDF = useCallback(async () => {
        try {
            console.log('Starting PDF generation process...');
            if (!formData) {
                console.error('No form data available');
                return;
            }
            
            const success = await generatePDF('preview-content', formData);
            if (success) {
                console.log('PDF generated successfully');
            }
        } catch (error) {
            console.error('Failed to generate PDF:', error);
        }
    }, [formData]);

    const demoButton = (
        <button
            key="demo"
            className="flex items-center gap-2 px-4 py-2 bg-[#E4F222] text-gray-800 font-medium hover:bg-[#cdd71f] transition-colors rounded-none"
            onClick={loadDemoData}
        >
            Load Demo Data
        </button>
    );

    const pdfButton = (
        <button
            key="pdf"
            className="flex items-center gap-2 px-4 py-2 bg-[#E4F222] text-gray-800 font-medium hover:bg-[#cdd71f] transition-colors rounded-none"
            onClick={handleGeneratePDF}
        >
            Generate PDF
        </button>
    );

    const actionButtons = useMemo(() => (
        <div className="flex gap-2">
            {demoButton}
            {pdfButton}
        </div>
    ), []);

    useEffect(() => {
        setActions(actionButtons);
        return () => setActions(null);
    }, [setActions, actionButtons]);

    const inputClass = "block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#E4F222] sm:text-sm sm:leading-6";
    const labelClass = "block text-sm font-semibold leading-6 text-gray-900 mb-2";

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Travel Expense Generator</h1>
            
            <div className="flex h-full gap-16">
                <div className="w-1/2">
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:p-8">
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6">
                                <div className="col-span-full">
                                    <label htmlFor="type" className={labelClass}>
                                        Expense Type
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={expenseType}
                                        onChange={(e) => handleExpenseTypeChange(e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="HOTEL">Hotel Folio</option>
                                        <option value="AIRLINE">Airline Reservation</option>
                                    </select>
                                </div>

                                {expenseType === 'AIRLINE' && (
                                    <>
                                        <div className="col-span-full">
                                            <label htmlFor="airline" className={labelClass}>
                                                Select Airline
                                            </label>
                                            <select
                                                id="airline"
                                                name="airline"
                                                value={formData.airline}
                                                onChange={(e) => handleAirlineChange(e.target.value)}
                                                className={inputClass}
                                            >
                                                {Object.entries(AIRLINES).map(([key, value]) => (
                                                    <option key={key} value={key}>
                                                        {value.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="referenceNumber" className={labelClass}>
                                                Reference Number
                                            </label>
                                            <input
                                                type="text"
                                                name="referenceNumber"
                                                id="referenceNumber"
                                                value={formData.referenceNumber}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="flightNumber" className={labelClass}>
                                                Flight Number
                                            </label>
                                            <input
                                                type="text"
                                                name="flightNumber"
                                                id="flightNumber"
                                                value={formData.flightNumber}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="origin" className={labelClass}>
                                                    Origin
                                                </label>
                                                <input
                                                    type="text"
                                                    name="origin"
                                                    id="origin"
                                                    value={formData.origin}
                                                    onChange={handleInputChange}
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="destination" className={labelClass}>
                                                    Destination
                                                </label>
                                                <input
                                                    type="text"
                                                    name="destination"
                                                    id="destination"
                                                    value={formData.destination}
                                                    onChange={handleInputChange}
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="departureDate" className={labelClass}>
                                                    Departure Date & Time
                                                </label>
                                                <DatePicker
                                                    selected={formData.departureDate}
                                                    onChange={(date) => handleDateChange(date, 'departureDate')}
                                                    showTimeSelect
                                                    dateFormat="MMM d, yyyy h:mm aa"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="arrivalDate" className={labelClass}>
                                                    Arrival Date & Time
                                                </label>
                                                <DatePicker
                                                    selected={formData.arrivalDate}
                                                    onChange={(date) => handleDateChange(date, 'arrivalDate')}
                                                    showTimeSelect
                                                    dateFormat="MMM d, yyyy h:mm aa"
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="bookingClass" className={labelClass}>
                                                Booking Class
                                            </label>
                                            <input
                                                type="text"
                                                name="bookingClass"
                                                id="bookingClass"
                                                value={formData.bookingClass}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="totalAmount" className={labelClass}>
                                                Total Amount (USD)
                                            </label>
                                            <input
                                                type="text"
                                                name="totalAmount"
                                                id="totalAmount"
                                                value={formData.totalAmount}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-1/2">
                    <div className="sticky top-[104px]">
                        <TravelExpensePreview 
                            formData={formData}
                            expenseType={expenseType}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelExpenseContent; 