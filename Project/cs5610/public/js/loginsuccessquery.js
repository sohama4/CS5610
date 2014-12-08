// Attach a submit handler to the form
$( "#categorysearch" ).submit(function(event) 
{
 
  // Stop form from submitting normally
	  event.preventDefault();
	 
	  // Get some values from elements on the page:
	  var $form = $(this);
	  url = $form.attr("action");
	  if(selected.length == 0)
	  {
	  	$('.errors').show();	
	  	$('.errors').html('Please select at least one category!');
	  }  
	  else
	  {
	  	
	  	$('.hider').click(function()
	  		{
	  			$('.formdiv').slideDown("slow", function()
	  			{
	  				$('.showdiv').hide("slow");
	  				$('.resultdiv').remove();
	  			});
	  		});
	  	$('.errors').hide();
	  	$(".formdiv").slideUp("slow", function() 
	  	{
	  		$('.showdiv').show();
			var toSearch = [];
			for(var i=0; i<selected.length; i++)
			{
				if(selected[i].indexOf('Sports') !== -1)
					toSearch.push('Sports');
				else if(selected[i].indexOf('Technology') !== -1)
					toSearch.push('Technology');
				else if(selected[i].indexOf('Film') !== -1)
					toSearch.push('Film');
				else if(selected[i].indexOf('Economics') !== -1)
					toSearch.push('Economics');
				else if(selected[i].indexOf('Health') !== -1)
					toSearch.push('Health');
				else if(selected[i].indexOf('Travel') !== -1)
					toSearch.push('Travel');
				else if(selected[i].indexOf('Fashion') !== -1)
					toSearch.push('Fashion');
				else if(selected[i].indexOf('Science') !== -1)
					toSearch.push('Science');
			}
			for(var i=0; i<toSearch.length; i++)
			{
				var searchTerm = toSearch[i];
				var url = 'http://content.guardianapis.com/search?q=' + searchTerm + '&api-key=pkcztdbthwfvd64t5ev32p35&show-fields=all';
	  			$.getJSON(url).done(function(data)
				{
					console.log(data);
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
	      		});
	  		}
		});	
	}
});