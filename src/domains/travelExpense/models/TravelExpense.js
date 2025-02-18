export class TravelExpense {
    constructor() {
        this.transactionDate = new Date();
        this.vendor = '';
        this.totalAmount = 0.0;
        this.currency = "USD";
        this.paymentMethod = '';
        this.expenseType = null;
        this.referenceNumber = '';
    }
}

export class HotelFolio extends TravelExpense {
    constructor() {
        super();
        this.expenseType = "HOTEL";
        this.checkInDate = null;
        this.checkOutDate = null;
        this.roomRate = 0.0;
        this.roomTaxes = 0.0;
        this.incidentalCharges = [];
        this.guestName = '';
        this.roomNumber = '';
        this.hotelAddress = '';
    }
}

export class AirlineReservation extends TravelExpense {
    constructor() {
        super();
        this.expenseType = "AIRLINE";
        this.flightNumber = '';
        this.departureDate = null;
        this.arrivalDate = null;
        this.passengerName = '';
        this.origin = '';
        this.destination = '';
        this.fare = 0.0;
        this.taxes = 0.0;
        this.bookingClass = '';
        this.ticketNumber = '';
    }
} 