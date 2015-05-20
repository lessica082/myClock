import Ember from 'ember';

var Utils = {
  addZeroes: function(value) {
    if(value < 10) {
      return '0'+value;
    }
    return value;
  }
};

var stopwatchController = Ember.ArrayController.extend({

	  isRunning:       false,
    startTime:       null,
    lapTime:         null,
    ellapsedTime:    0,
    ellapsedLapTime: 0,
    timeInterval:    10,
    
    showlap:         '00:00.00',
    showtotal:       '00:00.00',
    laplist:         [] ,
    
    leftButtonVal:   'Start',
    rightButtonVal:  'Lap',
    disabled:        true,
  
    leftButtonClass: 'button-start' ,
    rightButtonClass: '' ,

  actions: {
    handleLeftButton: function() {
      if(this.get('isRunning')) {
        this.stop();
      } else {
        this.start();
      }
    },
  
    handleRightButton: function() {
      if(this.get('isRunning')) {
        this.lap();
      } else {
        this.reset();
      }
    }
  },

	start: function() {
		var self = this;
        self.set('isRunning', true);
    	
      this.set('leftButtonClass', 'button-stop').set('leftButtonVal','Stop');
      this.set('rightButtonClass', 'button-lap').set('disabled',false).set('rightButtonVal', 'Lap');
     
    	self.set('startTime', new Date().getTime() );  
     	self.set('lapTime',   new Date().getTime() );
    	self.set('startTime', self.get('startTime')- self.get('ellapsedTime')  );
    	self.set('lapTime'  , self.get('lapTime') - self.get('ellapsedTime')  );
      
    	setTimeout(function() {
    		self.handleTimer();
    	}, this.timeInterval);
    },

	stop: function() {
	    this.set('isRunning', false);  
      this.set('leftButtonClass',  'button-start').set('leftButtonVal' , 'Start');
      this.set('rightButtonClass', 'button-reset').set('rightButtonVal', 'Reset');
  
    },

  lap: function() {
    var lapTime   = this.get('lapTime');
    var newlap = {
            id :        this.get('laplist').length+1 ,
            timepoint:  this.formatTimeFromMilliseconds(new Date().getTime()-lapTime) ,        
        };

    this.laplist.pushObject(newlap);
    this.set('lapTime', new Date().getTime() );
 
  },

	reset: function() {
      this.set('ellapsedTime', 0);
      this.set('ellapsedLapTime', 0);
      this.set('showlap' , '00:00.00').set('showtotal' , '00:00.00').set('laplist',[]);
      
      this.set('rightButtonClass','').set('disabled',true);
      this.set('rightButtonVal','Lap');

    },

 	handleTimer: function() {
    var now       = new Date().getTime(),
        startTime = this.get('startTime'),
        lapTime   = this.get('lapTime') ,
        self      = this;
         
    self.set('showtotal', this.formatTimeFromMilliseconds(now-startTime) );
    self.set('showlap', this.formatTimeFromMilliseconds(now-lapTime)  );

    self.set('ellapsedTime', now-startTime  );
    self.set('ellapsedLapTime', now-lapTime );
    
    if(self.get('isRunning')) {
      setTimeout(function() {
        self.handleTimer();
      }, this.timeInterval);
    }
  }, 

	formatTimeFromMilliseconds: function(milliseconds) {
      var minutes = parseInt((milliseconds / 60 / 1000),10),
          seconds = parseInt(milliseconds / 1000, 10) - minutes*60,
          tenths  = parseInt((milliseconds - seconds*1000 - minutes*60000)/10, 10);

      return Utils.addZeroes(minutes)  + ":" + Utils.addZeroes(seconds) + "." + Utils.addZeroes(tenths); 
    },

  init: function() {
    var self = this;
    $("#stopwatch .left-button").click(function() {
      self.handleLeftButton();
    });
    $("#stopwatch .right-button").click(function() {
      self.handleRightButton();
    });
  },

});

export default stopwatchController;

