/**
 * PlaylistController
 *
 * @description :: Server-side logic for managing playlists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const ObjectId = require('sails-mongo/node_modules/mongodb').ObjectID;

function isLiked (playlist,userId){
	for (video of playlist.videos){
		var isLiked = false;

        if (video.likes == undefined){
            isLiked = false;
        }

        else{
            for(i = 0; i < video.likes.length; i++) {
                if (video.likes[i]==userId){
                    isLiked = true;
                    video.isLiked = true;
                    break;
                }
            }
		}

		if (isLiked == false){
			video.isLiked = false;
		}
	}
    //isFavourite (playlist,userId)
}

function isFavourite (playlist,userId){
    for (video of playlist.videos){
        var isFavourite = false;
        console.log("fav array: "+ video.favourites);
        if (video.favourites == undefined){
            isFavourite = false;
		}
		else{
            for(i = 0; i < video.favourites.length; i++) {
                if (video.favourites[i]==userId){
                    isFavourite = true;
                    video.isFavourite = true;
                    break;
                }
            }
		}
        if (isFavourite == false){
            video.isFavourite = false;
        }

    }
    //isLiked (playlist,userId)
}


module.exports = {
   // createPlaylist - create a playlist
  //  can create with associations - refer video-portal/client/src/app/mock-data/create-Playlist.json.js
   createPlaylist: function(request, response){
     var playlist = request.body;
     Playlist.create(playlist).exec(function (error, playlist){
       if (error) {
         return response.serverError(error);
       }

       sails.log('playlist\'s id is:', playlist.id);
       return response.json(playlist);
     });
   },

   //getPlaylists - Send all playlists
   getPlaylists: function(request, response){
	   	var userId = request.token;

     	Playlist.find().populate('videos').exec(function(error, playlists){
       if (error) {
         // handle error here- e.g. `res.serverError(err);`
         return;
       }

       for (playlist of playlists){
		   isLiked(playlist,userId);
           isFavourite(playlist,userId);
	   }

       response.json(playlists);
     });
   },

   // get Playlist details
   getPlaylist: function(request, response){

	   	var userId = request.token;
	   	var id;

       User.findOne(userId).exec(function (error, user) {
       		console.log(user);
           if (error) return error;
           //id = user.id;
       });

     	Playlist.findOne(request.params.playlist_id).populate('videos').exec(function(error, playlist) {

     	isLiked(playlist,userId);
     	isFavourite(playlist,userId);

		if(error){
			// handle error
			return response.negotiate(error);
		}

		return response.json(playlist);
		}
		);

   },

	  // getUsersWhoCanAnswerComments - Send users list who can answer comments with contact details
  	getUsersWhoCanAnswerComments: function(request, response){
  		console.log("1playlist id:"+request.param('playlist_id'));
  		PlaylistService.getUsersWhoCanAnswerComments({
        	playlist_id : request.param('playlist_id')
      	}, function getUserListCallback(error, users){
        	if (!error) {
        		console.log("2users array:"+users);
          		response.json(users);
        	}
      	});
  	},

    // add videos to the playlist
  	addVideos: function(request, response){
  		Playlist.findOne(request.params.playlist_id).exec(function(error, playlist) {
  			if(error){
  				// handle error
  				return response.negotiate(error);
  			}
  			console.log("Body:")
			console.log(request.params.playlist_id)
			console.log(playlist)
			console.log(request.body)
  			// Queue up a records to be inserted into the join table
  			playlist.videos.add(request.body.videos);

  			// Save the playlist, creating the new associations in the join table
  			playlist.save(function(error) {
  				if (error) {
          			return response.negotiate(error);
        		}
        		sails.log('videos added');
        		return response.ok();
  			});
		  });
  	},

  	// remove videos
    // body should be - { videos : [list of video_ids] }
  	removeVideos: function(request, response){
  		Playlist.findOne(request.params.playlist_id).exec(function(error, playlist) {
  			if(error){
  				// handle error
  				return response.negotiate(error);
  			}

  			for (video of request.body.videos){
  				playlist.videos.remove(video);
  			}

  			// Save the playlist, creating the new associations in the join table
  			playlist.save(function(error) {
  				if (error) {
          			return response.negotiate(error);
        		}
        		sails.log('videos removed');
        		return response.ok();
  			});
		  });
  	},



  	// TODO: add actions to add/remove users
};
