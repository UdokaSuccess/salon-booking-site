
const fetchBookings = async () =>{
const response = await fetch(`http://localhost:3000/bookings`);
const allBookings = await response.json();
const todayDate = new Date().toISOString().split('T')[0]
console.log(todayDate)


// Sort all bookings by earliest
const sortedBookings = allBookings.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
});


// Get today bookings
const loopBooking = allBookings.filter(booking => {
    return booking.date === todayDate

});

const gatherTodayBoooking = loopBooking.map( booking =>{
    return `    <div class="today-bookings">                
                <div class="today-booking-card">
                    <div class="booking-time">${booking.bookingTime}</div>
                    <div class="booking-info">
                        <h3>${booking.name}</h3>
                        <p>${booking.serviceItem}</p>
                        <p class="phone">${booking.phone}</p>
                    </div>
                    <div class="booking-price">${booking.price}</div>
                </div>
            </div>`
}).join('')

document.getElementById('admin-today').innerHTML = gatherTodayBoooking


// all bookings table
 const bookings = sortedBookings.map(booking =>{

        return `<tr>
                    <td>${booking.name}</td>
                    <td>${booking.serviceItem}</td>
                    <td>${booking.date}</td>
                    <td>${booking.bookingTime}</td>
                    <td>${booking.phone}</td>
                    <td>
                        <button class="btn-view">View</button>
                        <button class="btn-cancel">Reschedule</button>
                    </td>
                        </tr>`
 }).join('');

document.getElementById('admin-section').innerHTML = 
    
        `<h2>All Bookings</h2>
        <div class="table-wrapper">
            <table class="bookings-table">
                <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
                ${bookings}
            </table>
        </div>`

}


fetchBookings()