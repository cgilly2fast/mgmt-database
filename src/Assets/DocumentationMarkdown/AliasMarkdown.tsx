const AliasMarkdown = `

  ## How Create an alias ?

  * Go to the **.firebaserc** page.

  * See JSON.

  * Find projects on the JSON and Write prod and project name.

  * Example:	

  ~~~js

            “projects”: {
                   “default”: “ghotels-development”,
                   ault”: “ghotels-development”,
                   [default project-id]
                   “prod”: “ghotels-production-a266d”,
                   [other project-id] 
            } 

  ~~~

  * After, Find targets on the JSON and add the new project's hosting.

  * Example: 

  ~~~js

            "targets": {
                  "ghotels-development": {
                        "hosting": {
                            "ghotels-web": ["ghotels-web"],
                            "mgmt-web": ["mgmt-web"]
                        }
                  },
              
                  "ghotels-production-a266d": {
                        "hosting": {
                            "ghotels-web":["ghotels-web-production"],
                            "mgmt-web": ["mgmt-web-prod"]
                        }
                  },
            },

  ~~~

  * save .

  * After using the command
  
  ~~~js

  ‘firebase use default’

  ~~~

  * then run development and use the command 

  ~~~js

  ‘firebase use prod’ 

  ~~~
  
  * then run production.
  `;

export default AliasMarkdown;
