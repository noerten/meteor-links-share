Meteor.methods({

    upvote: function(websiteId) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You are not logged in");
        var website = Websites.findOne(websiteId);
        if (_.include(website.voters, user._id))
            throw new Meteor.Error(422, 'You have already voted');
        Websites.update(website._id, {
            $addToSet: {voters: user._id},
            $inc: {upvotes: 1, votes: 1}

        });
    },
    downvote: function(websiteId) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You are not logged in");
        var website = Websites.findOne(websiteId);
        if (_.include(website.voters, user._id))
            throw new Meteor.Error(422, 'You have already voted');
        Websites.update(website._id, {
            $addToSet: {voters: user._id},
            $inc: {downvotes: 1, votes: -1}

        });
    }
    });


Meteor.publish('websites', function() {
    return Websites.find();
});

Meteor.publish('comments', function() {
    return Comments.find();
});

Meteor.methods({
    comment: function(commentAttributes) {
        var user = Meteor.user();
        var website = Websites.findOne(commentAttributes.postId);
        // ensure the user is logged in
        // if (!user)
        //     throw new Meteor.Error(401, "You need to login to make comments");
        // if (!commentAttributes.body)
        //     throw new Meteor.Error(401, 'Please write some content');
        // if (!post)
        //     throw new Meteor.Error(401, 'You must comment on a post');
        comment = _.extend(_.pick(commentAttributes, 'postId', 'body'), {
            userId: user._id,
            author: user.emails[0].address,
            submitted: new Date().getTime()
        });

        return Comments.insert(comment);
    }
});