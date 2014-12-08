$(document).ready(function() 
{

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
		var text = $(this).text();
		switch(text)
		{
			case 'Home':
				window.location = "/loginsuccess";
				break;
			case 'User Activity':
				window.location = "/viewActivity";
				break;
			case 'Write':
				window.location = "/write";
				break;
			case 'Search':
				window.location = "/search";
				break;
			case 'Log out!':
				window.location = "/logout";
				break;
			case 'Books!':
					window.location = "/books";
					break;
		}
	});
});

function getWordCount(wordString) 
{
	var words = wordString.split(" ");
	words = words.filter(function(words) { 
	return words.length > 0
	}).length;
	return words;
}

jQuery.validator.addMethod("wordCount",
   function(value, element, params) 
	{
		var count = getWordCount(value);
		if(count >= params[0]) 
		{
			return true;
		}
	},
	jQuery.format("A minimum of {0} words is required here.")
);


// When the browser is ready...
$(function() {

// Setup form validation on the #register-form element
$("#write").validate({

    // Specify the validation rules
    rules: {
        title: {
            required: true,
            wordCount: ['5']
        },
        article: {
            required: true,
            wordCount: ['300']
        }
    },
    
    // Specify the validation error messages
    messages: {
        title: {
            required: "Please provide a title",
            wordCount: "Your title must have at least 5 words"
        },
        article: {
            required: "Please provide some content!",
            wordCount: "Your content must be 300 words long"
        },
        username: "Please enter a valid email address",
    },
    errorLabelContainer: '#errors',
    wrapper:'li',
    submitHandler: function(form) {
        form.submit();
    }
});

});
















