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
        status: '',
        notes: '',
        favorite: '',
        start: 0,
        end: 5,
        totalPages: [],
        currentPage: 0,
        activePage: 0,
    },
    methods: {
        submitApplication: function () {
            const csrftoken = Cookies.get('csrftoken');
            axios({
                method: 'POST',
                url: '../save_application/',
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
                app.getApplications()
                app.jobTitle = '',
                app.companyName = '',
                app.dateApplied = '',
                app.compensationType = '',
                app.compensationAmount = 0,
                app.typeOfHire = '',
                app.shift = '',
                app.status = '',
                app.notes = '',
                app.favorite= ''
            })
        },
        getApplications: function () {
            axios ({
                method: 'get',
                url: '../applications/'
            }).then (function (response) {
                app.applications = response.data.applications
                app.totalPagesPagination()
            })
        },
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
                        app.getApplications()  
                    })
                }
            })
        },
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
                        app.getApplications()
                        app.editApplication = {}
                    })
                    
                
        },
        getApplicationId: function (applicationIdEdit){
            this.editApplication = applicationIdEdit
        },
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
                        app.getApplications()
                    })
                }
            }); 
        },
        chartToggle: function (typeOfChart) {
            if (typeOfChart == 'pie') {
                document.getElementById('pie-chart').className = 'visible';
                document.getElementById('bar-chart').className = 'hidden';
            } else {
                document.getElementById('pie-chart').className = 'hidden';
                document.getElementById('bar-chart').className = 'visible'; 
            }
        },
        totalPagesPagination: function () {
            this.totalPages = []
            let arrayLen = this.filteredApplications.length 
            let pagesInt = Math.ceil(arrayLen / 5) 
            for (let i=0; i<pagesInt; i++) {
                this.totalPages.push(i)
            }
            if (this.totalPages.length == 1) {
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
        pageDisplay: function (pageNumber) {
            this.currentPage = pageNumber
            if (pageNumber == 0) {
                this.start = 0,
                this.end = 5
            } else {
                this.start = 5 * pageNumber
                this.end = this.start + 5
            }
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

            document.getElementById(this.currentPage).className = 'page-item active';

            for (let i=0; i < this.totalPages.length; i++) {
                if (i !== this.currentPage) {
                    document.getElementById(i).className = 'page-item';
                }
            }

        },
        nextButton: function () {
            this.pageDisplay(this.currentPage + 1)

            document.getElementById(this.currentPage).className = 'page-item active';

            for (let i=0; i < this.totalPages.length; i++) {
                if (i !== this.currentPage) {
                    document.getElementById(i).className = 'page-item';
                }
            }
        },
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
    created: function () {
        this.getApplications()
    },
    computed: {
        filteredApplications: function () {
            return this.applications.filter((application) => {
                return application.job_title.toUpperCase().match(this.search.toUpperCase()) || application.company_name.toUpperCase().match(this.search.toUpperCase()) || application.status.toUpperCase().match(this.search.toUpperCase());
            })
        }
    }
})

