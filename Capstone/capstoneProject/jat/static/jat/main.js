// start vue app
const app = new Vue ({
    el: '#app',
    delimiters: ['[[', ']]'], // {{}} won't work with django being used in HTML so need to provide a new character for Vue to use
    data: {
        editApplication: {},
        search: '',
        applications: [],
        jobTitle: '',
        companyName: '',
        dateApplied: '',
        compensationType: '',
        compensationAmount: '',
        typeOfHire: '',
        shift: '',
        status: 'applied',
        notes: '',
        favorite: 'false',
        start: 0,
        end: 5,
        totalPages: [],
        currentPage: 0,
        activePage: 0,
        formCompleted: false,
        updateFormCompleted: true,
    },
    methods: {
        // function to evaluate all fields are filled before submitting new application
        evaluateFormFields: function () {
            if (this.jobTitle !== '' && this.companyName !== '' && this.dateApplied !== '' && this.compensationType !== '' && this.compensationAmount !== '' && this.typeOfHire !== '' && this.status !== '' && this.shift !== '') {
                this.formCompleted = true
            } else {
                this.formCompleted = false
            }
        },


        // function to save new applications to our database by using POST request and using Django in our back end to assign values into their proper variables
        submitApplication: function () {
            const csrftoken = Cookies.get('csrftoken');
            axios({
                method: 'POST',
                url: '../save_application/', // django url/view function to save new applications
                headers: {'X-CSRFToken': csrftoken},
                data: {
                    job_title: app.jobTitle,
                    company_name: app.companyName,
                    date_applied: app.dateApplied,
                    compensation_type: app.compensationType,
                    compensation_amount: app.compensationAmount,
                    type_of_hire: app.typeOfHire,
                    shift: app.shift,
                    status: app.status,
                    notes: app.notes,
                    favorite: app.favorite,
                }
            }).then(response => {
                app.getApplications() // once the new applications has been saved we call this function to get fresh and updated info from our backend
                app.jobTitle = '', // we set all of our variables in the front end back to empty so they can be ready for the next New Application
                app.companyName = '',
                app.dateApplied = '',
                app.compensationType = '',
                app.compensationAmount = '',
                app.typeOfHire = '',
                app.shift = '',
                app.status = '',
                app.notes = '',
                app.favorite= '',
                app.formCompleted= false
            })
        },
        // function to pull data from our backend using django generated API
        getApplications: function () {
            axios ({
                method: 'get',
                url: '../applications/' // django url / views function making backend data available for front end through API
            }).then (function (response) {
                app.applications = response.data.applications // assign all the data we get from our API to variable applications (array)
                app.totalPagesPagination() // call this function to display an updated pagination number of pages
            })
        },
        // function to favorite and unfavorite applications we pass the application ID and send that data to our backend so the new updated favorite value can be stored in our data base
        // we loop through our filteredApplications and if the current application id matches the ID we passed from our HTML v-on:click
        // we assign csrf token into a variable, use POST method, use url from our django backend to send our data, assign our csrf variable to headers, pass our itemID as an identifier to our django backend
        favoriteToggle: function (itemId) {
            this.filteredApplications.forEach(application => {
                if (application.id === itemId) {
                    const csrftoken = Cookies.get('csrftoken');
                    axios({
                        method: 'POST',
                        url: '../favorite_toggle/',
                        headers: {'X-CSRFToken': csrftoken},
                        data: {
                            identifier: itemId
                        }
                    }).then(response => {                        
                        app.getApplications()  // once our database has been updated we use this function to update and display the most current database data
                    })
                }
            })
        },


        // function to evaluate all fields are filled before submitting updated application
        evaluateFormFieldsUpdate: function () {
            if (this.editApplication.job_title !== '' && this.editApplication.company_name !== '' && this.editApplication.date_applied !== '' && this.editApplication.compensation_type !== '' && this.editApplication.compensation_amount !== '' && this.editApplication.type_of_hire !== '' && this.editApplication.status !== '' && this.editApplication.shift !== '') {
                this.updateFormCompleted = true
            } else {
                this.updateFormCompleted = false
            }
        },



        // function to update existing applications using POST request by sending updated information by storing the updated information inside variable editApplication (object)
        // the way we get the application selected for editing into our new variable editApplication is by using v-on:click in our application table properties and calling function getApplicationId and passing the 'application' from our HTML file
        // we then access each item inside the object like editApplication.job_title
        updateApplication: function (itemId) {
            
                    const csrftoken = Cookies.get('csrftoken');
                    axios({
                        method: 'POST',
                        url: '../update_application/',
                        headers: {'X-CSRFToken': csrftoken},
                        data: {
                            identifier: itemId,
                            job_title: app.editApplication.job_title,
                            company_name: app.editApplication.company_name,
                            date_applied: app.editApplication.date_applied,
                            compensation_type: app.editApplication.compensation_type,
                            compensation_amount: app.editApplication.compensation_amount,
                            type_of_hire: app.editApplication.type_of_hire,
                            shift: app.editApplication.shift,
                            status: app.editApplication.status,
                            notes: app.editApplication.notes,
                            favorite: app.editApplication.favorite,
                        }
                    }).then(response => {
                        app.getApplications() // get the most updated data from our database to display current information in our frontend
                        app.editApplication = {} // set our variable to empty again so it can be ready to hold a new applications data for editing
                    })
                    
                
        },
        // function to assign the selected application for editing into our variable editApplication using data passed from HTML file
        getApplicationId: function (applicationIdEdit){
            this.editApplication = applicationIdEdit
        },
        // function to delete application using applicationId passed from HTML file and then looping through all the applications for current user
        // once we have a matching application ID we proceed to use a post request to send an identifier (application ID) to our backend and use Django views function to delete application from database
        deleteApplication: function (applicationId) {
            this.filteredApplications.forEach(application => {
                if (application.id === applicationId) {
                    const csrftoken = Cookies.get('csrftoken');
                    axios({
                        method: 'POST',
                        url: '../delete_application/',
                        headers: {'X-CSRFToken': csrftoken},
                        data: {
                            identifier: applicationId
                        }
                    }).then(response => {
                        app.getApplications() // update our frontend with latest database information
                    })
                }
            }); 
        },
        // function to hide and show charts when user clicks on either of the charts by selecting HTML elements by ID and setting their className to either visible or hidden
        // css hidden and visible classes created to set properties accordingly 
        chartToggle: function (typeOfChart) {
            if (typeOfChart == 'pie') {
                document.getElementById('pie-chart').className = 'visible';
                document.getElementById('bar-chart').className = 'hidden';
            } else {
                document.getElementById('pie-chart').className = 'hidden';
                document.getElementById('bar-chart').className = 'visible'; 
            }
        },
        // function to display the number of pages to be displayed on the screen displaying 5 items per page
        totalPagesPagination: function () {
            this.totalPages = [] // set our totalPages variable to empty to have a fresh start every time this function  gets called
            let arrayLen = this.filteredApplications.length // get array length from filteredApplications
            let pagesInt = Math.ceil(arrayLen / 5) // we get the number of pages by diving array length by 5 (number of items per page) and use math ceil to ceil the result to the next whole number
            for (let i=0; i<pagesInt; i++) {
                this.totalPages.push(i) // we push each number into our totalPages variable array which we will loop over in our HTML page
            }
            // first if statement to hide our previous and next buttons if there is only one page or if there are no applications at all
            // second if statement to hide the 'previous' button if our current page is on the first page while there is more than 1 page
            // third if statement to hide the 'next' button if our current page is on the last page while there is more than 1 page
            // last if statement makes both buttons visible for any other condition not covered before
            if (this.totalPages.length == 1 || this.totalPages.length == 0) {
                document.getElementById('previous').className = 'hidden';
                document.getElementById('next').className = 'hidden'; 
            } else if (this.currentPage == 0 && this.totalPages.length > 1) {
                document.getElementById('previous').className = 'hidden';
                document.getElementById('next').className = 'page-item'; 
            } else if (this.currentPage == this.totalPages.length - 1 && this.totalPages.length > 1) {
                document.getElementById('previous').className = 'page-item';
                document.getElementById('next').className = 'hidden';                 
            } else {
                document.getElementById('previous').className = 'page-item';
                document.getElementById('next').className = 'page-item';                 
            }
            
        },
        // function to set start and end variables that will be use for .slice method in our HTML to display the accurate applications on each page
        pageDisplay: function (pageNumber) {
            this.currentPage = pageNumber // we set our current page to the data passed from our HTML
            // if pageNumber is at page 0 (first item in our array of totalPages) we display items 0-5 by setting start=0 and end=5
            // for everything else we just multiply 5 * pageNumber for start and we just add 5 to our start for our end variable
            if (pageNumber == 0) { 
                this.start = 0,
                this.end = 5
            } else {
                this.start = 5 * pageNumber
                this.end = this.start + 5
            }
            // same if statements that we used for totalPagesPagination function
            if (this.totalPages.length == 1 || this.totalPages.length == 0) {
                document.getElementById('previous').className = 'hidden';
                document.getElementById('next').className = 'hidden'; 
            } else if (this.currentPage == 0 && this.totalPages.length > 1) {
                document.getElementById('previous').className = 'hidden';
                document.getElementById('next').className = 'page-item'; 
            } else if (this.currentPage == this.totalPages.length - 1 && this.totalPages.length > 1) {
                document.getElementById('previous').className = 'page-item';
                document.getElementById('next').className = 'hidden';                 
            } else {
                document.getElementById('previous').className = 'page-item';
                document.getElementById('next').className = 'page-item';                 
            }

            // we access HTML element with ID and set its class to be highlighted as the active item
            document.getElementById(this.currentPage).className = 'page-item active';

            // we loop over our totalPages and as long as the current iteration doesn't match the current page we set the HTML element class to non-active
            for (let i=0; i < this.totalPages.length; i++) {
                if (i !== this.currentPage) {
                    document.getElementById(i).className = 'page-item';
                }
            }

        },
        // function to make 'next' button display the next page by increasing our current page to +1 and passing that into pageDisplay function
        nextButton: function () {
            this.pageDisplay(this.currentPage + 1)

            document.getElementById(this.currentPage).className = 'page-item active';

            for (let i=0; i < this.totalPages.length; i++) {
                if (i !== this.currentPage) {
                    document.getElementById(i).className = 'page-item';
                }
            }
        },
        // function to make 'previous' button display the previous page by decreasing our current page to -1 and passing that into pageDisplay function
        previousButton: function () {
            this.pageDisplay(this.currentPage - 1)

            document.getElementById(this.currentPage).className = 'page-item active';

            for (let i=0; i < this.totalPages.length; i++) {
                if (i !== this.currentPage) {
                    document.getElementById(i).className = 'page-item';
                }
            }
        }
    
    },
    // we call our getApplication function at created to display all the current information
    created: function () {
        this.getApplications()
    },


    // if the value changes in any of the variables under watch it will run the function to evaluate all fields
    watch: {
        jobTitle: function () {
            this.evaluateFormFields()
        },
        companyName: function () {
            this.evaluateFormFields()
        },
        dateApplied: function () {
            this.evaluateFormFields()
        },
        compensationType: function () {
            this.evaluateFormFields()
        },
        compensationAmount: function () {
            this.evaluateFormFields()
        },
        typeOfHire: function () {
            this.evaluateFormFields()
        },
        shift: function () {
            this.evaluateFormFields()
        },
        editApplication: {
            handler(){
              this.evaluateFormFieldsUpdate()
            },
            deep: true
         }
    },


    // we use a computed function to create search bar functionality by using filter in our application variable array (holds all the applications (objects))
    // we return the items that will be used in our search like job title, company name, and status
    computed: {
        filteredApplications: function () {
            return this.applications.filter((application) => {
                return application.job_title.toUpperCase().match(this.search.toUpperCase()) || application.company_name.toUpperCase().match(this.search.toUpperCase()) || application.status.toUpperCase().match(this.search.toUpperCase());
            })
        }
    }
})

