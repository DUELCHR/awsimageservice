service ImageService {
    type Image {
        image : LargeString;
        url: String;
    }
    function getImage(url:String) returns Image;
    function getSignedUrl(url:String) returns String;
}