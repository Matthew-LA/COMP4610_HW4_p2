/**
 * File: multiplicationScript.js.html
 * GUI Assignment: HW4 part 2
 * Description: jQuery UI Slider and Tab Widgets
 * Matthew Lorette Anaya, UMass Lowell Computer Science, Matthew_loretteanaya@student.uml.edu
 * Copyright (c) 2023 by Matt. All rights reserved. May be freely copied or
 * excerpted for educational purposes with credit to the author.
 * updated by Matthew Lorette Anaya on June 22, 2023
*/

/*
 * Creates a multiplication table based on the provided boundaries for 
 * multiplier and multiplicand.
 *
 * @param {number} minMultiplier - Lower bound for the multiplier.
 * @param {number} maxMultiplier - Upper bound for the multiplier.
 * @param {number} minMultiplicand - Lower bound for the multiplicand.
 * @param {number} maxMultiplicand - Upper bound for the multiplicand.
 * @return {HTMLElement} - Constructed multiplication table.
 */
// Run this code when the document is ready
$(function() {

  // Function to create a jQuery UI slider and link it to an input field
  function createSlider(inputSelector, sliderSelector, options) {

    // Get references to the input and slider elements
    const $input = $(inputSelector);
    const $slider = $(sliderSelector);

    // Set the slide and change handlers for the slider
    options.slide = function(event, ui) {
      // When the slider is moved, update the value of the input field
      $input.val(ui.value);
    };
    options.change = function(event, ui) {
      // When the slider's value is changed, update the value of the input field
      // but only if this change event was triggered by a user interaction
      if (ui.originalEvent) {
        $input.val(ui.value);
      }
    };

    // Initialize the slider with the provided options
    $slider.slider(options);

    // When the input field's value is changed, update the slider's value to match
    $input.on('change', function() {
      $slider.slider('value', this.value);
    });
  }

  // Function to create a multiplication table
  function createMultiplicationTable(minMultiplier, maxMultiplier, minMultiplicand, maxMultiplicand) {
    
    // Create a table element
    const multiplicationTable = document.createElement('table');
    multiplicationTable.id = 'multiplicationTable';
  
    // Loop over the rows
    for(let rowIndex = minMultiplicand - 1; rowIndex <= maxMultiplicand; rowIndex++) {
      const row = document.createElement('tr');
      
      // Loop over the columns
      for(let columnIndex = minMultiplier - 1; columnIndex <= maxMultiplier; columnIndex++) {

        // Create a cell (either a th or a td, depending on the position)
        const cell = document.createElement((rowIndex === minMultiplicand - 1 || columnIndex === minMultiplier - 1) ? 'th' : 'td');

        // Set the text of the cell based on its position
        if(rowIndex === minMultiplicand - 1 && columnIndex === minMultiplier - 1) {
          cell.textContent = '';
        } else if(rowIndex === minMultiplicand - 1) {
          cell.textContent = columnIndex;
        } else if(columnIndex === minMultiplier - 1) {
          cell.textContent = rowIndex;
        } else {
          cell.textContent = rowIndex * columnIndex;
        }

        // Append the cell to the row
        row.appendChild(cell);
      }

      // Append the row to the table
      multiplicationTable.appendChild(row);
    }

    // Return the created table
    return multiplicationTable;
  }

  // Create sliders for the four input fields
  createSlider('#multiplierMinValue', '#multiplierMinValueSlider', {min: -50, max: 50});
  createSlider('#multiplierMaxValue', '#multiplierMaxValueSlider', {min: -50, max: 50});
  createSlider('#multiplicandMinValue', '#multiplicandMinValueSlider', {min: -50, max: 50});
  createSlider('#multiplicandMaxValue', '#multiplicandMaxValueSlider', {min: -50, max: 50});

  // Function to submit the form
  function submitForm() {
    // Only submit the form if it is valid
    if ($('#multiplicationForm').valid()) {
      $('#multiplicationForm').submit();
    }
  }

  // When the 'generate' button is clicked, prevent the default action and submit the form
  $('#generateButton').on('click', function(e) {
    e.preventDefault();
    submitForm();
  });

  // Initialize the tabs
  const $tabs = $('#tabs').tabs();

  // Counter for the number of tabs
  let tabCounter = 1;

  // Validate the form on submit
  $('#multiplicationForm').validate({
    // Define the validation rules
    rules: {
      multiplierMinValue: {required: true, number: true, range: [-50, 50]},
      multiplierMaxValue: {required: true, number: true, range: [-50, 50]},
      multiplicandMinValue: {required: true, number: true, range: [-50, 50]},
      multiplicandMaxValue: {required: true, number: true, range: [-50, 50]}
    },
    // Define the validation error messages
    messages: {
        // (omitted for brevity)
    },
    // When the form is submitted and valid, prevent the default action and add a new tab
    submitHandler: function(form, event) {
      event.preventDefault();
      
      // Create the multiplication table
      const multiplicationTable = createMultiplicationTable(
        form.elements['multiplierMinValue'].value,
        form.elements['multiplierMaxValue'].value,
        form.elements['multiplicandMinValue'].value,
        form.elements['multiplicandMaxValue'].value
      );

      // Create a new tab with the multiplication table in it
      const $tab = $('<div>')
        .attr('id', 'tab' + tabCounter)
        .append(multiplicationTable);

      // Add the new tab to the tab list
      $tabs.find('ul').append(
        $('<li>')
          .append($('<a>').attr('href', '#tab' + tabCounter).text('Tab ' + tabCounter))
          // Add a button to remove the tab
          .append($('<button>').text('X').click(function() {
            // Remove the tab and the corresponding panel
            const panelId = $(this).closest('li').remove().attr('aria-controls');
            $('#' + panelId).remove();
            // Refresh the tabs
            $tabs.tabs('refresh');
          }))
      );

      // Add the new tab panel
      $tabs.append($tab);
      // Refresh the tabs
      $tabs.tabs('refresh');
      // Make the new tab active
      $tabs.tabs('option', 'active', -1);

      // Increment the tab counter
      tabCounter++;
    }
  });
});
