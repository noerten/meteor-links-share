Meteor.subscribe('websites');
Meteor.subscribe('comments');


Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
    this.render('navbar', {
        to:"navbar"
    });
    this.render('main_page', {
        to:"main"
    });
}, {
    name: 'main_page'
});

Router.route('/:_id', function () {
    this.render('navbar', {
        to:"navbar"
    });
    this.render('one_website', {
        to:"main",
        data:function(){
            return Websites.findOne({_id:this.params._id});
        }
    });
}, {
    name: 'one_site'
});



	// accounts
	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({}, {sort:{votes:-1}});
		}
	});

    //formatting date
    Template.registerHelper('formatDate', function(date) {
        var m_names = ["January", "February", "March",
            "April", "May", "June", "July", "August", "September",
            "October", "November", "December"];
        return (m_names[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear());
    });

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
					createdOn: new Date(),
                    upvotes: 0,
                    downvotes: 0,
                    votes: 0
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

Template.one_website.helpers({
    comments: function() {
        return Comments.find({postId: this._id});
    }
});

Template.comment.helpers({
    submittedText: function() {
        return new Date(this.submitted).toString();
    }
});

Template.commentSubmit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var $body = $(e.target).find('[name=body]');
        var comment = {
            body: $body.val(),
            postId: template.data._id
        };

        Meteor.call('comment', comment, function(error, commentId) {
            if (error){
                throwError(error.reason);
            } else {
                $body.val('');
            }
        });
    }
});