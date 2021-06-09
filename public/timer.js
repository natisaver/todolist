
(function() {
    // variable to store our current state
    var cbstate;
    
    // bind to the onload event
    window.addEventListener('load', function() {
      // Get the current state from localstorage
      // State is stored as a JSON string
      cbstate = JSON.parse(localStorage['CBState'] || '{}');
    
      // Loop through state array and restore checked 
      // state for matching elements
      for(var i in cbstate) {
        var el = document.querySelector('input[name="' + i + '"]');
        if (el) el.checked = true;
      }
    
      // Get all checkboxes that you want to monitor state for
      var cb = document.getElementsByName('checkboxx');
    
      // Loop through results and ...
      for(var i = 0; i < cb.length; i++) {
    
        //bind click event handler
        cb[i].addEventListener('click', function(evt) {
          // If checkboxe is checked then save to state
          if (this.checked) {
            cbstate[this.name] = true;
          }
      
      // Else remove from state
          else if (cbstate[this.name]) {
            delete cbstate[this.name];
          }
      
      // Persist state
          localStorage.CBState = JSON.stringify(cbstate);
        });
      }
    });
  })();



//countdown timer.

var start = document.getElementById("start");
var pause = document.getElementById("pause");
var reset = document.getElementById("reset");

var h = document.getElementById("h");
var m = document.getElementById("m");
var s = document.getElementById("s");
var isPaused = false;

h.value = 0;
m.value = 0;
s.value = 0;

//functions to start timer and stop
var starttimer = null;

function timerfunction(){
  if (s.value == 0 & h.value==0 & m.value==0){ //hit 0 stay at 0
    h.value = 0;
    m.value = 0;
    s.value = 0;
  }
  //decrease seconds, minutes then hours
  else if( s.value!=0){
    s.value --;
  }
  else if (m.value!=0 && s.value==0){
    m.value--;    
    s.value = 59;
  }
  else if (h.value!=0 && m.value==0){
    h.value--;
    m.value = 60;
  }
  
}

function stoptimer(){
  clearInterval(starttimer); //clears the setInterval
}


//start, pause & reset buttons
start.addEventListener("click", function(){
  if(s.value<0 || h.value<0 || m.value<0){
    alert("Value must be more than or equal to 0");
  }
  else{
    isPaused = false;
    if(!isPaused){
      starttimer = setInterval(function(){timerfunction()}, 1000); //timerfunction is called every second
    } 
    console.log("counting down...");
  }

})

reset.addEventListener("click", function(){
    h.value = 0;
    m.value = 0;
    s.value = 0;
    stoptimer();
})

pause.addEventListener("click", function(){
  isPaused = true;
  console.log("pausing...")
})