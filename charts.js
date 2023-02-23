function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    console.log(sampleArray);
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var newSampleArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    console.log(newSampleArray);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(metadataArray);
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var firstSample = newSampleArray[0];
    console.log(firstSample);
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var newMetadataArray = metadataArray[0];
    console.log(newMetadataArray);
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = firstSample.otu_ids;
    console.log(otuIDs);
    var otuLabels = firstSample.otu_labels;
    console.log(otuLabels);
    var sampleValues = firstSample.sample_values;
    console.log(sampleValues);
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var washingFreq = parseFloat(newMetadataArray.wfreq);
    console.log(washingFreq);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuIDs.slice(0,10).map(id => `otuID ${id}`).reverse();
    console.log(yticks);
    // Deliverable 1: 8. Create the trace for the bar chart. 
    var trace1 = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otuLabels.slice(0,10).reverse()
    };
    
    var barData = [trace1];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var trace2 = {
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIDs,
        colorscale: "Rainbow",
        size: sampleValues
      }
    };
    var bubbleData = [trace2];
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Culters Per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
      margin: {
        l: 100,
        r: 100,
        b: 50,
        t: 50,
        pad: 4
      }
    }
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var trace3 = {
      value: washingFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "Scrubs Per Week"},
      gauge: {
        axis: { range: [null, 10] },
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "greenyellow"},
          {range: [8, 10], color: "green"},
        ],
        bar: {color: "black"}
      }
    };
    var gaugeData = [trace3];
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title: "Belly Button Washing Frequency",
      margin: {
        l: 30,
        r: 30,
        b: 30,
        t: 30
      }

    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
