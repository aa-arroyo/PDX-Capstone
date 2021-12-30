// define variables for counters
let applied = 0;
let notSelected = 0; 
let selectedForInterview = 0; 
let interviewed = 0; 
let offer = 0; 
let declined = 0; 
let ghosted = 0;

let applications = []

axios ({
    method: 'get',
    url: '../applications/'
}).then (function (response) {
    applications = response.data.applications
    // loop through applications
    applications.forEach(application => {
        if (application.status === 'applied') {
            applied += 1
        }
        else if (application.status === 'not-selected') {
            notSelected += 1
        }
        else if (application.status === 'selected-for-interview') {
            selectedForInterview += 1
        }
        else if (application.status === 'interviewed') {
            interviewed += 1
        }
        else if (application.status === 'offer') {
            offer += 1
        }
        else if (application.status === 'declined') {
            declined += 1
        }
        else if (application.status === 'ghosted') {
            ghosted += 1
        }
    });
})


// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(draw3dChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
    let data = google.visualization.arrayToDataTable([
      ['Job Status', 'Number of Job Applications', { role: 'style' } ],
      ['Applied', applied, 'color: aqua'],
      ['Not Selected', notSelected, 'color: red'],
      ['Selected For Interview', selectedForInterview, 'color: blue'],
      ['Interviewed', interviewed, 'color: orange'],
      ['Offer', offer, 'color: green'],
      ['Declined', declined, 'color: darkgray'],
      ['Ghosted', ghosted, 'color: gray'],
    ]);

    // Set chart options
    let barchart_options = {'title':'Job Application Status \n Total Job Applications: ' + applications.length,
                            'width':800,
                            'height':600};
           

    // Instantiate and draw our chart, passing in some options.
    let barchart = new google.visualization.BarChart(document.getElementById('bar-chart'));
    barchart.draw(data, barchart_options);
}

function draw3dChart() {
    let data = google.visualization.arrayToDataTable([
        ['Job Status', 'Number of Job Applications'],
        ['Applied', applied],
        ['Not Selected', notSelected],
        ['Selected For Interview', selectedForInterview],
        ['Interviewed', interviewed],
        ['Offer', offer],
        ['Declined', declined],
        ['Ghosted', ghosted]
    ]);

    let options = {
      title: 'Job Application Status \n Total Job Applications: ' + applications.length,
      'width':800,
      'height':600,
      is3D: true,
      slices: {0: {color: 'aqua'}, 1:{color: 'red'}, 2:{color: 'blue'}, 3: {color: 'orange'}, 4:{color: 'green'}, 5:{color: 'darkgray'}, 6:{color: 'gray'}}
    };

    let chart = new google.visualization.PieChart(document.getElementById('pie-chart'));
    chart.draw(data, options);
}