/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const ObjectId = require('sails-mongo/node_modules/mongodb').ObjectID;

module.exports = {
  // createVideo - create a video
 //  can create with associations - add playlists while creating
  createVideo: function(request, response){
    var video = request.body;
    Video.create(video).exec(function (error, video){
      if (error) {
        return response.serverError(error);
      }

      sails.log('video\'s id is:', video.id);
      return response.json(video);
    });
  },

	//getUsersWhoCanAnswerComments - Send users list who can answer comments with contact details
  	getUsersWhoCanAnswerComments: function(request, response){
  		// var video = sails.middleware.blueprints.findOne(request, response);
  		// var video = {};
  		// Video.find(request.params.id).exec(function(error, videos){
  		// 	if (error) {
    // 			// handle error here- e.g. `res.serverError(err);`
    // 			return;
  		// 	}
  		// 	video = videos[0];
  		// });

  		// User.find(id in video[]).exec(function(error, users){
  		// 	if (error) {
    // 			// handle error here- e.g. `res.serverError(err);`
    // 			return;
  		// 	}
  		// 	var userArray = [];
  		// 	for (user of users){
  		// 		var tempUser = {};
  		// 		tempUser.fullName = user.firstName + ' ' + user.lastName;
  		// 		tempUser.id = user.id;
  		// 		tempUser.email = user.email;
  		// 		tempUser.contactNumber = user.contactNumber;
  		// 		tempUser.designation = user.designation;
  		// 		userArray.push(tempUser);
  		// 	}
  		// 	response.json(userArray);
  		// });
  	},

  addLike: function (request, response) {
    //var userId = request.token;
    var userId = 3;
    var videoId = request.params.video_id;
    Video.findOne(videoId).exec(function (error, video) {
      if (error) return error;

      if (video.likes.constructor !== Array)
        video.likes = [];

      const oldList = video.likes ? video.likes : [];

      const totalList = Array.from(new Set(oldList.concat([userId])));
      //const totalList = Array.from(new Set(oldList.concat(newList)));
      User.native((err, collection) =>{
        collection.update({_id: new ObjectId(videoId)}, {$set:{likes:totalList}});
      response.json(totalList);
    });
    });
  }
};
