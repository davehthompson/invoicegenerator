import { useState } from 'react';
import { generateFlightData } from '../utils/flightDataGenerator';

export const useTravelExpenseForm = () => {
    const [expenseType, setExpenseType] = useState('AIRLINE');
    const [formData, setFormData] = useState({
        // Airline fields
        airline: 'DELTA',
        referenceNumber: '',
        flightNumber: '',
        origin: '',
        destination: '',
        departureDate: new Date(),
        arrivalDate: new Date(),
        bookingClass: 'BUSINESS (OS)',
        totalAmount: '',

        // Hotel fields
        hotel: 'HILTON',
        folioNumber: '',
        checkInDate: new Date(),
        checkOutDate: new Date(),
        roomType: 'KING BED',
        roomRate: '199.00',
        roomCharge: '398.00',
        taxesAndFees: '47.76',
    });

    const handleExpenseTypeChange = (type) => {
        setExpenseType(type);
    };

    const handleHotelChange = (hotel) => {
        setFormData(prev => ({
            ...prev,
            hotel: hotel
        }));
    };

    const handleAirlineChange = (airline) => {
        setFormData(prev => ({
            ...prev,
            airline: airline
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: date
        }));
    };

    const loadDemoData = () => {
        const demoData = generateFlightData();
        setFormData(prev => ({
            ...prev,
            ...demoData
        }));
    };

    return {
        formData,
        expenseType,
        handleInputChange,
        handleDateChange,
        handleExpenseTypeChange,
        handleAirlineChange,
        handleHotelChange,
        loadDemoData
    };
}; 