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
	    	var url = 'http://content.guardianapis.com/search?q=' + values['q'] + '&format=json&from-date=2013-01-01&show-tags=contributor&show-fields=all&&page-size=50&show-refinements=all&api-key=pkcztdbthwfvd64t5ev32p35';
	    else
	    	var url = 'http://' + location.host + '/searchme/' + values['q'];
	    
	    $.getJSON(url).done(function(data)
		{
			console.log(data);
			if(data.response != undefined)
			{
				
	  			$.each(data.response.results, function(i, doc) 
	  			{
	  				var title = doc.fields.headline;
	  				var id = doc.id;
	  				var url = doc.webUrl;
	  				var image = doc.fields.thumbnail;
	  				(image === undefined) ? image = '/css/images/nophoto.png' : image = image;
	  				var description = doc.fields.trailText;
	  				var author = doc.fields.byline;
	  				var date = doc.fields.firstPublicationDate;
	  				(date === undefined) ? date = 'Not known' : date = date.substring(0, 10);
	  				var html = '<img title="' + description + '" class=bookimg src=' + image + ' /><a href=/readarticle/' + id + ' target=_blank><h5>' + title + '</h5></a><p style="float:left;">Author: ' + author + '<br>Date Published: ' + date;
	  				jQuery('<div/>', 
					{
						class: 'resultdiv',
						id: 'resultdiv' + (i + 1),
						rel: 'external',
						html: html
					}).appendTo('.showdiv');
	 				
        		});
	  		}
			else
				if(jQuery.isEmptyObject(data))
					jQuery('<div/>', 
					{
						class: 'resultdiv',
						id: 'result0',
						html: 'No matching articles found locally.'
					}).appendTo('.showdiv');
				else
					$.each(data, function(i, doc) 
					{
						var title = doc.title;
						var author = doc.Author;
		  				var id = doc.articleID;
		  				var image = '/css/images/nophoto.png';
		  				var time = new Date(Number(doc.Time));
		  				var html = '<img title="' + title + '" class=bookimg src=' + image + ' /><a href=/readarticle/user/' + id + ' target=_blank><h5>' + title + '</h5></a><p style="float:left;">Author: ' + author + '<br>First Published At: ' + time;
		  				jQuery('<div/>', 
						{
							class: 'resultdiv',
							id: 'resultdiv' + (i + 1),
							html: html
						}).appendTo('.showdiv');

		  			});
		});
	}
});