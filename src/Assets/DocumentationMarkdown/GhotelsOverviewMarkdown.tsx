const GhotelsOverviewMarkdown = `

  ##  GHotels-web :

  - It has a front side for the guests.

  - It uses Firebase and Reactjs and TypeScript.

  - It uses node js version 14.

  - It uses Firestore Database.

  - It uses the styled-components and react-bootstrap for designing.

  - Development server run locally this command

  ~~~js

  yarn dev

  ~~~ 

  - Production server run locally this command

  ~~~js

  yarn start

  ~~~ 

  - Development makes build from this command 

  ~~~js

  yarn dev-build

  ~~~ 

  - Production makes build from this command 

  ~~~js

  yarn build

  ~~~ 

  - To deploy on the Development side, First of all, using the command

  ~~~js

  firebase use default

  ~~~ 

  - Second step build create and last step is to deploy on the firebase using the command 

  ~~~js

  yarn deploy
  
  ~~~

  - To deploy on the production side, the Same step but some changes like the first step same but only changes where use **default** use **prod**. 
  
  - The second step uses the same command only changing the **dev-build** place using **build**. 
  
  - And the Final step is not changing both run the same command.

  `;

export default GhotelsOverviewMarkdown;
