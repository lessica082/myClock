import Ember from 'ember';

var Utils = {
  addZeroes: function(value) {
    if(value < 10) {
      return '0'+value;
    }
    return value;
  }
};

var timerController = Ember.ObjectController.extend({
	
    timeLeft:       0,
    isRunning:      false,
    snoozeDuration: 10 * 1000 * 60, // 10 min
    timeInterval:   1000,
    totalTime:     "",
    leftButtonVal:  'Start',
    rightButtonVal: 'Pause',

    leftButtonClass: 'button-start' ,
    rightButtonClass: '' ,
    
    disabled:   true,
    counterDisplay:  'display: none;' ,
    inputDisplay: '' ,

  actions: {
    handleLeftButton: function() {
      if(this.get('isRunning')) {
        this.cancel();
      } else {
        this.start();
      }
    },
  
    handleRightButton: function() {
      if(this.get('isRunning')) {
        this.pause();
      } else {
        this.resume();
      }
    }    
  },
  
	start: function() {
    var timerDurationInMilliseconds = ($("#timer .inputs .hours").val() * 3600000) +  ($("#timer .inputs .minutes").val() * 60000);
    
    if(timerDurationInMilliseconds !== 0) {

      this.set('leftButtonClass', 'button-cancel');
      this.set('rightButtonClass', 'button-pause');
      this.set('disabled',false);
      this.set('leftButtonVal' , 'Cancel');
      this.set('rightButtonVal', 'Pause');

      this.set('timeLeft' , timerDurationInMilliseconds);
      
      this.set('counterDisplay' ,  '');
      this.set('inputDisplay' ,   'display: none;') ;
        
      this.set('isRunning', true);
      this.handleTimer(); 
    }
  },
    
  cancel: function() {   

    this.set('counterDisplay' , 'display: none;');
    this.set('inputDisplay' , '') ;

    this.set('leftButtonClass', 'button-start');
    this.set('rightButtonClass', '');
    this.set('disabled',true);

    this.set('leftButtonVal','Start');
    this.set('rightButtonVal', 'Pause');


    this.set('isRunning', false);
    this.set('timeLeft', 0 );
    this.set('totalTime',"");
  },
    
  pause: function() {  
    this.set('rightButtonVal','Resume');
    this.set('isRunning', false);
  },

  resume: function() {
    if(!$("#timer .right-button").hasClass('disabled')) {
      this.set('rightButtonVal','Pause');
      this.set('isRunning', true);
      this.handleTimer();
    }
  },
    
  alarm: function() {
    var turnedOff = confirm("Alarm! If you want to snooze, press cancel.");
    
    if(!turnedOff) {
      this.set('timeLeft' , this.get('snoozeDuration')); // 10 minutes
      this.handleTimer();
    } else {
      this.cancel();
    }
  },

  handleTimer: function() {
    
    if(this.get('isRunning')) {
      var timeLeft    = this.get('timeLeft'),
          newTimeLeft = timeLeft-this.get('timeInterval'),
          self        = this;

      this.set('timeLeft' , newTimeLeft);
      if(newTimeLeft <= 0) {
        this.alarm();
        return;
      }

      this.set('totalTime', this.formatTimeFromMilliseconds(newTimeLeft) );
     
      setTimeout(function() {
        self.handleTimer();
      }, this.get('timeInterval') );  
    }
  },

  formatTimeFromMilliseconds: function(milliseconds) {
    var hours   = parseInt(milliseconds / 3600000, 10),
        minutes = parseInt(milliseconds / 60000, 10) - hours*60,
        seconds = parseInt(milliseconds / 1000, 10) - minutes*60 - hours*3600,
        ret     = '';
    
    if(hours !== 0) {
      ret += hours + ':';
    }
    ret += Utils.addZeroes(minutes) + ':' + Utils.addZeroes(seconds);
    return ret;
  },
  
  init: function() {
    var self = this;
    $("#timer .left-button").click(function() {
      self.handleLeftButton();
    });
    $("#timer .right-button").click(function() {
      self.handleRightButton();
    });
  } 

});

export default timerController;

