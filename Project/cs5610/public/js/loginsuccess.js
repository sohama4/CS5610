  var selected = [];
  $(document).ready(function() 
	{
			// animate hover text
		$('#hovershow').hide();

		$("#hovertext").hover(
	    function() 
	    {
	        // Styles to show the box
	        $('#hovershow').show("medium");
	    },
	    function () 
	    {
	        // Styles to hide the box
	        $('#hovershow').hide("medium");
	    });
			
		var colorArray = ['#2B65EC', '#4E9258', '#4C4646', '#0C090A', '#583759'];
		$('.showdiv').hide();
		var index = Math.floor(Math.random() * 4);
		// $('.category').css("background-color", colorArray[index]);
		
		// select the category boxes
		$('.category').click(function()
		{
		
			var html = $(this).attr('id');
			if($.inArray(html, selected) == -1)
			{
				// selecting a non selected category
				selected.push(html);
				$(this).stop().animate({"opacity": 1});
			}
			else
			{
				// deselecting a selected category
				var index = selected.indexOf(html);
				selected.splice(index, 1);
				$(this).stop().animate({"opacity": 0.6});
				
			}
		});
		// animate the navbar
		$('.navbarelements').hover(function()
		{
			$(this).css('cursor', 'pointer');
			$(this).stop().animate({'opacity': 1});
		},
		function()
		{
			$(this).stop().animate({'opacity': 0.6});
		});


		// make navbar clickable
		$('.navbarelements').click(function()
		{
			console.log("here");
			var text = $(this).text();
			switch(text)
			{
				case 'Home':
					window.location = "/loginsuccess";
					break;
				case 'User Activity':
					window.location = "/viewActivity";
					break;
				case 'Search':
					window.location = "/search";
					break;
				case 'Log out!':
					window.location = "/logout";
					break;
				case 'Write':
					window.location = "/write";
					break;
				case 'Books!':
					window.location = "/books";
					break;
			}
		});

		// animate the category boxes
		$('.category').hover(function()
		{
			var html = $(this).html();
			if($.inArray(html, selected) == -1)
		    	$(this).stop().animate({"opacity": 1});
		    else
		    	html = html;
		},function()
		{
			var html = $(this).html();
			if($.inArray(html, selected) == -1)
		    	$(this).stop().animate({"opacity": 0.6});
		    else
		    	html = html;
		});
	});