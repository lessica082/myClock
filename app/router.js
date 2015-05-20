import Ember from 'ember';

var Router = Ember.Router.extend({
  location: ClockENV.locationType
});

Router.map(function() {
	this.route('worldclock');
	this.route('timer');
	this.route('stopwatch');
	this.route('addcity');
});

export default Router;
