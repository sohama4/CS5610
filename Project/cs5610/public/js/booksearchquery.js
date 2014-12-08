// Attach a submit handler to the form
$( "#search" ).submit(function(event) 
{
	event.preventDefault();
	var $inputs = $('#search :input');
    var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
    });
    $('.result').remove();

    // reducing my problems
    $('.showdiv').html('');
    if(values['q'] !== '')
    {
	    // we have the input, now use API to search
	    if($("#search input[type='radio']:checked").val() == 2)
	    	var url = 'https://www.googleapis.com/books/v1/volumes?q=' + values['q'] + '&maxResults=20';
	    else
	    	var url = 'https://www.googleapis.com/books/v1/volumes?q=inauthor:' + values['q'] + '&maxResults=20';
	    $.getJSON(url).done(function(data)
		{
			if(jQuery.isEmptyObject(data))
				jQuery('<div/>', 
					{
						html: 'That search yielded no results. Please try again!'
					}).appendTo('.showdiv');
			else
			{
				$.each(data.items, function(i, doc)
				{
					console.log(doc);
					var googleLink = doc.accessInfo.webReaderLink;
					var volumeInfo = doc.volumeInfo;
					var isbn;
					var hrefUrl;
					if(volumeInfo.industryIdentifiers[1] === undefined)
						hrefUrl = googleLink;
					else
					{
						isbn = volumeInfo.industryIdentifiers[1].identifier;
						hrefUrl = '/review/' + isbn;
					}
					var imageLink;
					(volumeInfo.imageLinks === undefined) ? (imageLink = '/css/images/nophoto.png') : (imageLink = volumeInfo.imageLinks.thumbnail);
					var title = volumeInfo.title;

					(title === '') ? (title = 'ISBN: ' + isbn) : title = title;
					jQuery('<div/>', 
						{
							class: 'resultdiv',
							html: '<img title="' + title + '" class=bookimg src=' + imageLink + ' /><h5><p style="float:left;"><a href=' + hrefUrl +' target=_blank>' + title + '</a></p></h5>'
						}).appendTo('.showdiv');
				});

			}
		});
	}   
});