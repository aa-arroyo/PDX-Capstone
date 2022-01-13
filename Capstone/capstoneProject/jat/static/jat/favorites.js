const favoritesApp = new Vue ({
    el: '#favoritesApp',
    delimiters: ['[[', ']]'],
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
        myFavorites: [],
        favoriteTotalPages: [],
        favoriteCurrentPage: [],
        favoriteStart: 0,
        favoriteEnd: 0,
    },
    methods: {
        submitApplication: function () {
            const csrftoken = Cookies.get('csrftoken');
            axios({
                method: 'POST',
                url: '../save_application/',
                headers: {'X-CSRFToken': csrftoken},
                data: {
                    job_title: favoritesApp.jobTitle,
                    company_name: favoritesApp.companyName,
                    date_applied: favoritesApp.dateApplied,
                    compensation_type: favoritesApp.compensationType,
                    compensation_amount: favoritesApp.compensationAmount,
                    type_of_hire: favoritesApp.typeOfHire,
                    shift: favoritesApp.shift,
                    status: favoritesApp.status,
                    notes: favoritesApp.notes,
                    favorite: favoritesApp.favorite,
                }
            }).then(response => {
                favoritesApp.getApplications()
                favoritesApp.jobTitle = '',
                favoritesApp.companyName = '',
                favoritesApp.dateApplied = '',
                favoritesApp.compensationType = '',
                favoritesApp.compensationAmount = 0,
                favoritesApp.typeOfHire = '',
                favoritesApp.shift = '',
                favoritesApp.status = '',
                favoritesApp.notes = '',
                favoritesApp.favorite= ''
            })
        },
        getApplications: function () {
            axios ({
                method: 'get',
                url: '../applications/'
            }).then (function (response) {
                favoritesApp.applications = response.data.applications
                favoritesApp.getFavorites()
                favoritesApp.favoriteTotalPagesPagination()
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
                        favoritesApp.getApplications()  
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
                            job_title: favoritesApp.editApplication.job_title,
                            company_name: favoritesApp.editApplication.company_name,
                            date_applied: favoritesApp.editApplication.date_applied,
                            compensation_type: favoritesApp.editApplication.compensation_type,
                            compensation_amount: favoritesApp.editApplication.compensation_amount,
                            type_of_hire: favoritesApp.editApplication.type_of_hire,
                            shift: favoritesApp.editApplication.shift,
                            status: favoritesApp.editApplication.status,
                            notes: favoritesApp.editApplication.notes,
                            favorite: favoritesApp.editApplication.favorite,
                        }
                    }).then(response => {
                        favoritesApp.getApplications()
                        favoritesApp.editApplication = {}
                    })
                    
                
        },
        getFavorites: function () {
            this.myFavorites = []
            this.applications.forEach(application => {
                if (application.favorite == 'true') {
                    this.myFavorites.push(application)
                }
            });
        },
        favoriteTotalPagesPagination: function () {
            this.favoriteTotalPages = []
            let arrayLen = this.myFavorites.length 
            let pagesInt = Math.ceil(arrayLen / 5) 
            for (let i=0; i<pagesInt; i++) {
                this.favoriteTotalPages.push(i)
            }
            if (this.favoriteTotalPages.length == 1 || this.favoriteTotalPages.length == 0) {
                document.getElementById('favoritePrevious').className = 'hidden';
                document.getElementById('favoriteNext').className = 'hidden'; 
            } else if (this.favoriteCurrentPage == 0 && this.favoriteTotalPages.length > 1) {
                document.getElementById('favoritePrevious').className = 'hidden';
                document.getElementById('favoriteNext').className = 'page-item'; 
            } else if (this.favoriteCurrentPage == this.favoriteTotalPages.length - 1 && this.favoriteTotalPages.length > 1) {
                document.getElementById('favoritePrevious').className = 'page-item';
                document.getElementById('favoriteNext').className = 'hidden';                 
            } else {
                document.getElementById('favoritePrevious').className = 'page-item';
                document.getElementById('favoriteNext').className = 'page-item';                 
            }
        },
        favoritePageDisplay: function (pageNumber) {
            this.favoriteCurrentPage = pageNumber
            if (pageNumber == 0) {
                this.favoriteStart = 0,
                this.favoriteEnd = 5
            } else {
                this.favoriteStart = 5 * pageNumber
                this.favoriteEnd = this.favoriteStart + 5
            }
            if (this.favoriteTotalPages.length == 1  && this.favoriteTotalPages.length == 0) {
                document.getElementById('favoritePrevious').className = 'hidden';
                document.getElementById('favoriteNext').className = 'hidden'; 
            } else if (this.favoriteCurrentPage == 0 && this.favoriteTotalPages.length > 1) {
                document.getElementById('favoritePrevious').className = 'hidden';
                document.getElementById('favoriteNext').className = 'page-item'; 
            } else if (this.favoriteCurrentPage == this.favoriteTotalPages.length - 1 && this.favoriteTotalPages.length > 1) {
                document.getElementById('favoritePrevious').className = 'page-item';
                document.getElementById('favoriteNext').className = 'hidden';                 
            } else {
                document.getElementById('favoritePrevious').className = 'page-item';
                document.getElementById('favoriteNext').className = 'page-item';                 
            }

            if (this.favoriteCurrentPage > -1) {
                document.getElementById(this.favoriteCurrentPage).className = 'page-item active';
            }

            for (let i=0; i < this.favoriteTotalPages.length; i++) {
                if (i !== this.favoriteCurrentPage) {
                    document.getElementById(i).className = 'page-item';
                }
            }

        },
        favoriteNextButton: function () {
            this.favoritePageDisplay(this.favoriteCurrentPage + 1)

            document.getElementById(this.favoriteCurrentPage).className = 'page-item active';

            for (let i=0; i < this.favoriteTotalPages.length; i++) {
                if (i !== this.favoriteCurrentPage) {
                    document.getElementById(i).className = 'page-item';
                }
            }
        },
        favoritePreviousButton: function () {
            this.favoritePageDisplay(this.favoriteCurrentPage - 1)

            document.getElementById(this.favoriteCurrentPage).className = 'page-item active';

            for (let i=0; i < this.favoriteTotalPages.length; i++) {
                if (i !== this.favoriteCurrentPage) {
                    document.getElementById(i).className = 'page-item';
                }
            }
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
                        favoritesApp.getApplications()
                    })
                }
            }); 
        }
    },
    created: function () {
        this.getApplications()
        this.favoritePageDisplay(0)
    },
    computed: {
        filteredApplications: function () {
            return this.applications.filter((application) => {
                return application.job_title.toUpperCase().match(this.search.toUpperCase()) || application.company_name.toUpperCase().match(this.search.toUpperCase()) || application.status.toUpperCase().match(this.search.toUpperCase());
            })
        }
    }
})

