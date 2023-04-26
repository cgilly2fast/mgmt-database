import Roombooks from '../../Assets/Images/Roombook.png';
import Location from '../../Assets/Images/Location.png';
import Hotelsroom from '../../Assets/Images/Hotelsroom.png';

const GHotelsRoomboolMarkdown = `

  ## Room Booking Process for guests or users:

  1. First of all, open the Ghotels site.

  2. Second, if You visit first-time first finish the signup process, redirect the booking process, and have already signup successfully but an account is not logged in then first log in and follow the booking process. this step is optional.

  3. Select a city, Select check-in & check-out date, add how many guests, and press the search button.

  ![room book](${Roombooks})

  4. Select units and press them.

  ![Location](${Location})

  5. You go to the Units detail page. You get information on this unit on this page and also this page used to book units.

  ![Hotelsroom](${Hotelsroom})

  6. If selected check-in & check-out date then press the book button. Otherwise, first, select dates and then press the book button.

  7. You go to the payment page. the payment process finished successfully. Your booking process is finished.


  `;

export default GHotelsRoomboolMarkdown;
