Images = new Meteor.Collection('images');

if (Meteor.isClient) {
  Template.myImage.created = function(){
    loadFilePicker();
  };

  Template.myImage.events({
    'click #upload': function () {
      filepicker.pickAndStore(
        {
          mimetypes: ['image/gif','image/jpeg','image/png'],
          multiple: false
        },{
          access:"public"
        },
        function(InkBlobs){
          var InkBlob = _.first(InkBlobs);
          console.log(JSON.stringify(InkBlob));
          var image = Images.findOne({userId:Meteor.userId()});
          if(image){
            Images.update({_id:image._id},
            {
              $set:{
                filepickerId:_.last(InkBlob.url.split("/")),
                inkBlob:InkBlob
              }  
            });
          }else{
            Images.insert({
              userId:Meteor.userId(),
              filepickerId:_.last(InkBlob.url.split("/")),
              inkBlob:InkBlob,
              createdAt:new Date() //this isnt guarnteed accurate, but its ok for this simple demo
            });
          }
        },
        function(FPError){
           if(FPError && FPError.code !== 101)
            alert(FPError.toString());
        }
      );
    }
  });

  Template.myImage.helpers({
    'image': function () {
      return Images.findOne({userId:Meteor.userId()});
    }
  });

  Template.profileImages.helpers({
    'images': function () {
      return Images.find({},{sort:{createdAt:-1},limit:100});
    }
  });
}