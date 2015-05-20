import Ember from 'ember';

var AddcityController = Ember.ArrayController.extend({
	
	keyword:    "" ,
  	noResult:   true, 
  	typeNote:  "Please type to find a city.",

  	cityList: [],
 
  	actions: {

  		addToList: function(city) {
  			var post = this.store.createRecord('city',city);
  			post.save();
  			this.controllerFor('worldclock').init();
  			this.transitionToRoute('worldclock');
  		},

  		cancel: function() {
  			this.set('keyword' , ""); 
  			this.transitionToRoute('application');

  		}
  	},

  	searchCity: function(){
  		var keyword = this.get('keyword'),
  			len = keyword.length;
  		if(len===0){
  			this.set("typeNote", "Please type to find a city.").set("noResult",true);
  		}else if(len >0 && len <3){
  			this.set("typeNote", "Keep typing...").set("noResult",true);
  		}else {
  			this.set("noResult",false);
  		}

  		if(len > 2){
  			this.searchList(keyword);
  		}

  	}.observes('keyword'),

	listHandeler: function(res){
		var self = this;
		var data = [];
		for(var i=0; i < res.length ; i++){
			var capital = res[i].cityName.charAt(0).toUpperCase();
				// to test if the current capital is already in the data
			var capitalList = data.map(function(item) { return item.capital; });
			var index = capitalList.indexOf(capital);

			if(index=== -1){
				data.pushObject({
					"capital" : capital ,
					"list": 	[ res[i] ] ,
				});
			} else {
				data[index].list.push(res[i]);
			};
		}

		this.set('cityList',data);
	},

  	searchList:function(param) {
  		var self = this;
  		$.ajax({
		    //search the data
		      type: 'GET',
		      url: "http://coen268.peterbergstrom.com/timezones.php?search="+param,
		      async: false,
		      dataType: 'jsonp',
		      jsonp:'callback',

		      success: function(res) {
		      	if(res.length==0){
		      		self.set("cityList",[]).set("noResult",true)
		      			.set("typeNote", "No result found, try another city.");
		      	}else{
			        self.listHandeler(res);
		      	}
		      }		      
		    });
  	},
		
});

export default AddcityController;
