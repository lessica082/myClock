import Ember from 'ember';

var Utils = {
  addZeroes: function(value) {
    if(value < 10) {
      return '0'+value;
    }
    return value;
  }
};

var worldclockController = Ember.ArrayController.extend({
  EditorDone: "Edit",
  isEditing:  false , 
  hideTime: false ,

  timerInterval: 10000,
  data : [],

  actions:{

    deleteCity: function(city){
        
        this.store.find('city',city.id).then( function(post){
          post.destroyRecord();
        });
        this.init();
    }
  },
  
    setStatus:function(){
      var self = this;

      if(this.get('EditorDone')==="Edit"){
        self.set('EditorDone','Done');
        self.set("isEditing", true);
        self.set("hideTime", true);       
      }else{
        self.set('EditorDone','Edit');
        self.set("isEditing", false);
        self.set("hideTime", false);        
      }
    },  

    timeInfoForItemAtIndex: function(index) {
    var dataAtIndex = index,
        myTime      = new Date(),
        utcTime     = new Date(new Date().setMinutes(new Date().getMinutes()+myTime.getTimezoneOffset())),
        cityTime    = new Date(new Date(utcTime.getTime()).setMinutes(new Date().getMinutes()+dataAtIndex.timezoneOffset)); 

    var isToday     = cityTime.getDate() === myTime.getDate(),
          isTomorrow  = cityTime.getDate() > myTime.getDate(),
          isYesterday = cityTime.getDate() < myTime.getDate();
    
    var hourTimeDiff = (cityTime.getTime() - myTime.getTime()) / (1000 * 60 * 60);

    var diffString = '';
        if(hourTimeDiff <  0) {
          diffString = ", " + (-1*hourTimeDiff) + ' hours behind';
        } if(hourTimeDiff >  0) {
          diffString = ", " + (hourTimeDiff) + ' hours ahead';
        }
    
    var localTime = '',
        hours     = cityTime.getHours(),
        minutes   = cityTime.getMinutes();
        if (hours > 11) {
          localTime = (hours - 12) + ':' + Utils.addZeroes(minutes) + ' PM';
        } else {
          localTime = hours + ':' + Utils.addZeroes(minutes) + ' AM';
        }
      
      return {
        localTime: localTime,
        day: isToday ? "Today" : isTomorrow ? "Tomorrow" : "Yesterday",
        hours: diffString,        
      };
      
    },

    updateTime: function() {
      var result = this.get('data') ;
      var self = this;

      for(var i=0; i<result.length; i++) {        
          var info = this.timeInfoForItemAtIndex(result[i]);         
          result[i].localTime = info.localTime ;
          result[i].day = info.day ;
          result[i].hours = info.hours ;
      }
        self.set('data',result);
/*      
      setTimeout(function() {
          self.updateTime();
      }, self.get('timerInterval'));
 */   
    },

    init: function() {
      
      var self = this;
      this.store.find('city').then(function(citys){
        var data =[];
          citys.map(function(city){
            data.push({
                      id:city.get('id'),
                      cityName:city.get('cityName'),
                      timezoneName:city.get('timezoneName'),
                      timezoneOffset:city.get('timezoneOffset')
                  });
          });
      
      self.set("data",data);  
      self.updateTime();

      setTimeout(function() {
          self.init();
       }, self.get('timerInterval'));
    });
  },

});

export default worldclockController;