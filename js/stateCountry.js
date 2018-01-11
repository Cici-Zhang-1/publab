/**************************************************************
 *  DYNAMIC STATE COUNTRY SELECTOR
 *  Purpose: To dynamically add the State or Province select box depending on the choice of country.
 *  Author: Glen, with fixes from Brandon
 *  Date: Sept 15, 2009
 *
 *  This file should be deprecated eventually and productized into the UI
 *  Requirements: jQuery 1.3.2 or better needs to be included in the landing page.
 */

$(document).ready(function(){
  // When the document is ready, let's move all of the "state" options
  // into a collection, cached by "country" key.
  var stateOptions = {};

  // Get a reference to the state drop down (so we don't have to keep
  // finding it over and over again).
  var jState = $( "#State" );

  //IE6 is acting weird with the width
  jState.css("width","150px");

  //put the rel on the state/province
  $("#State option").each(function() {

    var optionVal = $(this).attr("value");
    switch(optionVal)
    {
      case "AB":
      case "BC":
      case "MB":
      case "NB":
      case "NF":
      case "NT":
      case "NS":
      case "NU":
      case "ON":
      case "PE":
      case "QC":
      case "SK":
      case "YT":
        $(this).attr("rel","CA");
        break;

      case "SelectProvince":
        $(this).attr("rel","CA").attr("value","");
        break;

      case "SelectState":
        $(this).attr("rel","US").attr("value","");
        break;

      case "":
        break;

      default:
        $(this).attr("rel","US");
    }
  });

  // Loop over each country and create an entry in the state options cache.
  $( "#Country" ).find( "option" ).each(
    function( index, option ){

      // Check to see that this option value has a length.
      // We can only create a key based on a valid value.
      if (option.value.length){

        // Create a cache for the state-based options. This will
        // be a jQuery collection of all the state options that should
        // be displayed if this country is selected.
        stateOptions[ option.value ] = jState.find( "option[ rel = '" + option.value + "' ]");
      }
    }
  );

  // This is a function that will update the options in the state-baesd
  // select box, based on the values in the country box.
  var updateStateList = function( countryCode ){
    // No matter what we do, we have to clear the state list first.
    jState.empty();

    // Now that we have an empty state list, let's see if we can repopulate
    // it with values from our state / country cache.
    if (countryCode.length && stateOptions[ countryCode ]){

      // Add the jQuery collection that we have cached at this country code.
      jState.append( stateOptions[ countryCode ] );

      // Select the first item in list.

      setTimeout(function () {
        $("#State option:first").attr("selected",true);
        //var thisJState = $( "#State" );
        //thisJState.get(0).selectedIndex = 0;
        }, 50);
    }
  }

  $("#Country").change(function()  {
    var selected = this.options[this.selectedIndex].value;
    var stateRow = $("#State").parents("li:first");

    switch(selected)
    {
      case "US":
        jState.addClass("mktFReq");
        stateRow.addClass("mktFormReq").slideDown().find("label").html("State:");

        // Update the state list.
        updateStateList( this.value );

        break;

      case "CA":
        jState.addClass("mktFReq");
        stateRow.addClass("mktFormReq").slideDown().find("label").html("Province:");

        // Update the state list.
        updateStateList( this.value );

        break;

      default:
        stateRow.removeClass("mktFormReq").slideUp();
        jState.removeClass("mktFReq");

        // Update the state list.
        updateStateList( this.value );
    }
  }).change();

  // pre-fill state/province since we just manipulated that select list.
  setTimeout(function () {
    if ((typeof mktoPreFillFields != 'undefined') && (mktoPreFillFields) && mktoPreFillFields['State']) {
      var jStateOption = $('#State option[value="' + mktoPreFillFields['State'] + '"]');
      if (jStateOption.val()) {
        jStateOption.attr('selected',true);
      }
    }
  }, 50);
});
