const app = new Vue ({
    el: '#app',
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
                    })
                }
            }); app.getApplications()
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

