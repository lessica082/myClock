import DS from "ember-data";
	var City = DS.Model.extend({
		//id:DS.attr('string'),
		cityName:DS.attr('string'),
		timezoneName:DS.attr('string'),
		timezoneOffset:DS.attr('number'),
	});
export default City;