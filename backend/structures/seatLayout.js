class SeatLayout {
    constructor (theaterName, rows, columns) {
        this.theaterName = theaterName;
        this.rows = rows;
        this.columns = columns;
        this.seats = [];
        this.init();
    }

    init() {
        for (let row = 1; row <= this.rows; row++) {
            for (let col = 1; col <= this.columns; col++) {
              this.seats.push({
                row,
                col,
                status: 'available',
              });
            }
          }
    }

    copy (seatLayout) {
      this.theaterName = seatLayout.theaterName;
      this.rows = seatLayout.rows;
      this.columns = seatLayout.columns;
      this.seats = seatLayout.seats;
    }

    setSeats (seats) {
      this.seats = seats;
    }

    bookSeat(row, column) {
        const seat = this.seats.find(s => s.row === row && s.col === column);
        console.log(seat);
        if (seat) {
            seat.status = 'booked';
            return true;
          }
        return false;
    }

    cancelSeat(row, column) {
      const seat = this.seats.find(s => s.row === row && s.col === column);
      if (seat) {
        seat.status = 'available';
        return true;
      }
      return;
    }
    

}

module.exports = SeatLayout;