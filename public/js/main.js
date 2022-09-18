//VARIABLES TO STORE CUSTOMER DATA TO SHOW SUMMARY AT THE END
let customerName = ''
let seatCount
let date
let time
let preOrderedFood = []
//SELECTORS
const multiStepForm = document.querySelector('[data-multi-step]')
const formSteps = [...multiStepForm.querySelectorAll('[data-step]')]
const foodContainer = multiStepForm.querySelector('[data-food-container]')
const summaryTextField = multiStepForm.querySelector('[data-summary-text]')
const foodItems = [...foodContainer.querySelectorAll('[data-food]')]
//FLAGS
const customerNameGreetPage = 0
const seatCountPage = 1
const dateSelectionPage = 2
const timeSelectionPage = 3
const foodCarouselPage = 4
const submitPage = 5

//FLAGS END HERE
let currentStep = formSteps.findIndex(step => {
    return step.classList.contains('active')
})//This returns the current step which has the active class as default

if (currentStep < 0) {
    currentStep = 0
    showCurrentStep()
}//Fail safe, if nothing has the active class, add it to the first section of the form

multiStepForm.addEventListener('click', e => {
    if (e.target.matches('[data-next]')) { //Check if user clicks the next button
        let inputs = formSteps[currentStep].querySelectorAll('input')[0].value //This selects the first input on each page of the form to get inputs
        switch (currentStep) {//Compare currentstep which is the index num of the sections in the form
            case customerNameGreetPage://Each case has a flag, see above lines 13 - 19; they refer to index numbers
                if (isInputValid(inputs)) {
                    spanUpdate(inputs)//Call input valid function below to check if the input isn't empty
                    customerName = inputs
                    currentStep += 1//Update currentstep so that the showCurrentStep can show the next page
                    showCurrentStep()
                    break;
                } else {
                    showError('Please enter your name...')//If input is invalid, throw error
                    break;
                }
            case seatCountPage:
                inputs = formSteps[currentStep].querySelectorAll('input')[0].value //ALWAYS SELECTS THE FIRST INPUT ON EACH PAGE 
                if (isNumberValid(inputs)) {
                    spanUpdate(inputs)
                    seatCount = inputs
                    currentStep += 1
                    showCurrentStep()
                    break;
                } else {
                    showError('Please enter a valid number less than 7...')
                    break;
                }
            case dateSelectionPage:
                inputs = formSteps[currentStep].querySelectorAll('input')[0].value //ALWAYS SELECTS THE FIRST INPUT ON EACH PAGE 
                if (isDateValid(inputs)) {
                    date = inputs
                    currentStep += 1
                    showCurrentStep()
                    break;
                } else {
                    showError('Selected date must not be in the past...')
                    break;
                }
            case timeSelectionPage:
                inputs = formSteps[currentStep].querySelectorAll('input')[0].value //ALWAYS SELECTS THE FIRST INPUT ON EACH PAGE 
                if (isTimeValid(inputs)) {
                    time = inputs
                    currentStep += 1
                    showCurrentStep()
                    break;
                } else {
                    showError('I am afraid we are open from 9AM until 8PM...')
                    break;
                }
            case foodCarouselPage:
                currentStep += 1
                showSummaryBooking()
                showCurrentStep()
                break;
            default:
            // code block
        }

    } else if (e.target.matches('[data-previous]')) {
        currentStep -= 1
        showCurrentStep()//If user clicks the back button, update currentstep and show previus section of the page
    } else {
        return //If nothing is clicked, do nothing
    }

})

foodContainer.addEventListener('click', e => {
    if (e.target.matches('[data-food]')) {
        e.target.classList.toggle('selected')//Food container, to show visually if something is selected
        const foodName = e.target.children[1].outerText // Get the text from the paragraph to then push it to an array to store preorders
        if (preOrderedFood.includes(foodName)) { //This section checks if the food has been pushed to the array already, if it exists already, then remove it from the array
            const foodIndex = preOrderedFood.indexOf(foodName)
            preOrderedFood.splice(foodIndex, 1)
        }
        else {
            preOrderedFood.push(foodName)//If the food isn't in the array, store it in the array
        }
    }
})

// FUNCTIONS
function showCurrentStep() {
    formSteps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep)//This function loops through each step of the forms, and toggling the active class if we the index equals to the currentstep
    })
}

function showError(message) {
    const errorBoxText = multiStepForm.querySelectorAll('[data-error]')
    const errorBox = multiStepForm.querySelectorAll('[data-error-container]')
    errorBox[currentStep].classList.toggle('hidden')
    errorBoxText[currentStep].innerText = message;//Message is passed through the switch cases from line 43 
}

function showSummaryBooking() {

    summaryTextField.innerText = `Please double check your booking details. 
    Name: ${capitalizeName(customerName)}
    Booked seats: ${seatCount}
    Date and time: ${date} ${time}
    Preordered food: ${preOrderedFood.join(', ')}
    Booking reference number: ${bookingRefNum()}
    `//Template literal to build summary of booking, name has a capitalize function, preordered food is separated by comma, and a random number generator function returns the booking reference
}

function log(element) {
    console.log(element)
}//Speed up console logging :) life changing

const spanUpdate = (textUpdateVariable) => {
    if (currentStep === 0) {//Update spans in the HTML to replace the innertext with user name
        const nameHolderSpans = [...multiStepForm.querySelectorAll('[data-customer-name-show]')]
        nameHolderSpans.forEach(span => {
            span.innerText = textUpdateVariable
        })
    } else if (currentStep === 1) {//Furthermore, if currentstep equals to seatcount page, update seatcounts 
        const seatCountHolderSpans = [...multiStepForm.querySelectorAll('[data-seat-count]')]
        seatCountHolderSpans.forEach(span => {
            span.innerText = textUpdateVariable
        })
    }

}
//FUNCTIONS ENDS
//SUMMARY PAGE SPECIFIC FUNCTIONS
const capitalizeName = (name) => name.charAt(0).toUpperCase() + name.slice(1)
const bookingRefNum = () => Math.floor(Math.random() * 10000) + 1000
//SUMMARY PAGE SPECIFIC FUNTIONS ENDS

//FUNCTIONS TO CHECK INPUTS
const isInputValid = (input) => {
    if (input.length > 1) {//Check if input is empty
        return true
    } else if (input.length === 0) {
        return false
    }
}
const isNumberValid = (input) => {
    if (!isNaN(input) && input < 7) {//Check if input is a valid number, and less than 7 to prevent overbooking tables
        return true
    } else {
        return false
    }
}

const isDateValid = (input) => {
    const today = new Date()
    if (new Date(input).getTime() >= today.getTime()) {//Create date object to compare it with user input
        return true
    } else {
        return false
    }
}

const isTimeValid = (input) => { //Check if time is between 9 and 21, I took the first part of the input time using split and returning the [0] first index number
    const hour = parseInt(input.split(':')[0])
    if (hour > 9 && hour < 21) {
        return true
    } else {
        return false
    }
}
