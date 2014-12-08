$(document).ready(function()
{
	var path = window.location.pathname;
	var id = path.substring(13, path.length);
	var url = 'http://' + window.location.host + '/view/' + id;

	$.getJSON(url).done(function(data)
	{
		if(jQuery.isEmptyObject(data))
			jQuery('<div/>', 
				{
					html: 'That search yielded no results. Please try again!'
				}).appendTo('.showdiv');
		else
		{
			console.log(data);
			if(data.response === undefined)
			{
				//local response
				data = data[0];
				var title = data.title;
				var author = data.Author;
				var content = data.content;
				var time = new Date(Number(data.Time));
				var url = data.URL
				$('.container h1').html(title);

				var html = 'Author: ' + author + '<br>' +
							'Date First Published: ' + time + '<br><hr>';

				$('.container h4').html('<a target=_blank href=' + url + '>View the original article</a>');

				jQuery('<div/>', 
				{
					html: html
				}).appendTo('.container');

				jQuery('<div/>', 
				{
					class: 'articlediv',
					html: content
				}).appendTo('.container');
			}
			else
			{
				data = data.response.content;
				var title = data.fields.headline;
				var author = data.fields.byline;
				var image = data.fields.thumbnail;
			  	(image === undefined) ? image = '/css/images/nophoto.png' : image = image;
				var firstPublicationDate = data.fields.firstPublicationDate;
				var trailText = data.fields.trailText;
				$('.container h1').html(title);

				var url = data.webUrl;
				var html = 'Author: ' + author + '<br>' +
							'Date First Published: ' + firstPublicationDate + '<br>' + 
							'<p style="color: gray">' + trailText + '</p><hr>';
				jQuery('<img/>', 
				{
					src: image,
					title: trailText
				}).appendTo('.container');


				$('.container h4').html('<a target=_blank href=' + url + '>View the original article</a>');
				jQuery('<div/>', 
				{
					html: html
				}).appendTo('.container');

				jQuery('<div/>', 
				{
					class: 'articlediv',
					html: data.fields.body
				}).appendTo('.container');
			}

		}
	});
});