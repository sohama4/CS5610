// When the browser is ready...
$(function() 
{

    // Setup form validation on the #login-form element
    $("#login-form").validate({

        // Specify the validation rules
        rules: {
            password: {
                required: true,
                minlength: 8
            },
            username: {
                required: true,
                email: true
            }
        },
        
        // Specify the validation error messages
        messages: {
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 8 characters long"
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
