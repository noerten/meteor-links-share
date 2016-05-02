
	// accounts
	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({});
		}
	});

	// Template.website_item.helpers({
	// 	votes: function(event) {
	// 		var site_id = this._id;
	// 		var upvote = Websites.findOne({_id:site_id}).upvotes;
    //
    //how to get current item in helper meteor from db
	// 		}
	// 	});

	Template.website_item.events({
		"click .js-upvote":function(e) {
			e.preventDefault();
			Meteor.call('upvote', this._id);
		},

		"click .js-downvote":function(e) {
			e.preventDefault();
			Meteor.call('downvote', this._id);
		}
	});

	//adding website
	Template.website_form.events({
		"click .js-toggle-website-form":function(){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			var title = event.target.title.value;
			var description = event.target.description.value;
			if (Meteor.user()) {
				Websites.insert({
					title: title,
					url: url,
					description: description,
					createdOn: new Date()
				});
			}
			console.log(url);
			$(".js-toggle-website-form").click();
			event.target.url.value = '';
			event.target.title.value = '';
			event.target.description.value = '';
			return false;// stop the form submit from reloading the page

		}
	});