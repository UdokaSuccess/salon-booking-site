const braids = document.querySelector("#braids")
const cut = document.querySelector("#cut")
const wigs = document.querySelector("#wigs")
const naturalHair = document.querySelector("#natural-hair")
const morning = document.querySelector("#morning-time")
const afternoon = document.querySelector("#afternoon-time")
const evening = document.querySelector("#evening-time")

const serviceType = document.querySelectorAll('.service');
const time = document.querySelectorAll('.time');


const summaryContainer = document.querySelector(".summary-container")



    const allServiceItems = document.querySelectorAll('input[name="serviceItem"]');
    const timeSlot = document.querySelectorAll('input[name="bookingTime"]');
    const timeLabel = document.querySelectorAll('.time-block');
  
    let serviceName = '';
    let price = '';
    let selectedTime = '';
    let date = '';
    let bookedTimes = []
    const dateinput = document.querySelector('.date-input')

allServiceItems.forEach(element => {
    element.addEventListener('click', () =>{
        serviceName = element.value;
        price = element.getAttribute('data-price');
       timeLabel.forEach(item => item.classList.remove('active'));
        element.parentElement.classList.add('active')

        console.log(price, serviceName)
        updateSummary()
    })
    });

dateinput.addEventListener('change', async (params) => {
    // To prevent past dates 
    const tomorrow = new Date();
   tomorrow.setDate(tomorrow.getDate() + 2); 
   const minDate = tomorrow.toISOString().split('T')[0];
  dateinput.setAttribute('min', minDate);

  const dateValue = dateinput.value
        const dateObject = new Date(dateValue)
        date = dateObject.toLocaleDateString('en-US', { weekday: 'short',  
            month: 'short',
             day: 'numeric',
             year: 'numeric'})

// to fetch bookeddates
const response = await fetch(`http://localhost:3000/bookings`);
    const allBookings = await response.json();

  const bookingsForTheDate = allBookings.filter(booking => booking.date === dateValue)

    bookedTimes = bookingsForTheDate.map(booking => booking.bookingTime);
    console.log(bookedTimes)
    updateSummary()
    timeSlot.forEach(element => {
    if (bookedTimes.includes(element.value)  ) {
        element.disabled = true
    element.parentElement.classList.add('booked') 
    }   
});  
})

timeSlot.forEach(element => {
    if (bookedTimes.includes(element.value)  ) {
    element.parentElement.classList.add('active') 
    }
    console.log('not booked')
    element.addEventListener('click', () =>{
        selectedTime = element.value
        timeLabel.forEach(item => item.classList.remove('active'));
        element.parentElement.classList.add('active')
        console.log(selectedTime)
       updateSummary()
    })    
});  


function updateSummary(params) {
        return summaryContainer.innerHTML = 
        `<h3>Booking Summary</h3>
                   <div class="summary-card">${serviceName}<span>${price}</span></div>
           <div class="summary-card">Date and time: <span>${date} ${selectedTime}</span></div>
            <div class="summary-card">Commitment fee <span>₦5000</span></div>`
    } 

const serviceMap = {
    'braid': braids,
    'wigs': wigs,
    'grooming': cut,
    'naturalhair': naturalHair
};

serviceType.forEach((element) => {
    element.addEventListener('click', function(){
        console.log(element.value)
        
        // Hide all sections
        Object.values(serviceMap).forEach(section => {
            section.style.display = 'none';
        });
        
        // Show only the selected one
        if (serviceMap[element.value]) {
            serviceMap[element.value].style.display = 'block';
        }
    })
});

const timeMap = {
 'morning': morning,
 'afternoon': afternoon,
'evening': evening
};

time.forEach((element) => {
    element.addEventListener('click', function(){
        console.log(element.value)
        
        // Hide all sections
        Object.values(timeMap).forEach(section => {
            section.style.display = 'none';
        });
        
        // Show only the selected one
        if (timeMap[element.value]) {
            timeMap[element.value].style.display = 'block';
        }
    })
});


// submit form
const form = document.getElementById('form')

const submitForm = async (event) => {
    event.preventDefault();
   
    try { 
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());
        
        const response = await fetch('http://localhost:3000/transaction/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: formObject.email, 
                amount: formObject.price, 
                bookingData: formObject })
        });

        const data = await response.json();
            console.log('submitted')
        console.log(data)
        
        console.log('Response status:', response.status);

        if (data.status) {
         window.location.href = data.data.authorization_url;
}
    //    const bookingId = data.bookingprofile._id;
        
    //     window.location.href = `/UI/success.html?id=${bookingId}`
        
    }
    catch (error) {
        console.error('Error:');
    }
}