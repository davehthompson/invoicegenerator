import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';

export const generatePDF = async (elementId, formData) => {
    try {
        console.log('Starting PDF generation...', { elementId, formData });
        
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Element with id "${elementId}" not found`);
        }
        console.log('Found element:', element);

        // Generate filename from form data
        const date = format(new Date(formData.departureDate), 'yyyyMMdd');
        const filename = `${formData.airline}_${formData.flightNumber}_${formData.origin}-${formData.destination}_${date}.pdf`;
        console.log('Generated filename:', filename);

        const opt = {
            margin: [10, 10],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: true, // Enable logging for debugging
                backgroundColor: '#ffffff'
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };

        console.log('Starting html2pdf conversion...');
        await html2pdf().set(opt).from(element).save();
        console.log('PDF generation completed');
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error; // Re-throw to handle in component
    }
}; 