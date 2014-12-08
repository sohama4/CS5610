// When the browser is ready...
$(function() {

// Setup form validation on the #register-form element
$("#register-form").validate({

    // Specify the validation rules
    rules: {
        fname: {
            required: true,
            minlength: 2
        },
        lname: {
            required: true,
            minlength: 2
        },
        username: {
            required: true,
            email: true
        }
    },
    
    // Specify the validation error messages
    messages: {
        fname: {
            required: "Please provide a first name",
            minlength: "Your first name must be at least 2 characters long"
        },
        lname: {
            required: "Please provide a last name",
            minlength: "Your last name must be at least 2 characters long"
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
