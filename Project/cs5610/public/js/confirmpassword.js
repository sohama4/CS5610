// When the browser is ready...
$(function() {

    // Setup form validation on the #confirmpassword-form element
    $("#confirmpassword-form").validate({

        // Specify the validation rules
        rules: {
            spassword: {
                required: true,
                minlength: 8,
            },
            cpassword: {
                required: true,
                minlength: 8,
                equalTo: "#spassword"
            },
        },
        
        // Specify the validation error messages
        messages: {
            spassword: {
                required: "Please provide a new password",
                minlength: "The new password must be at least 8 characters long",
            },
            cpassword: {
                required: "Please confirm the new password",
                minlength: "The password must be at least 8 characters long",
                equalTo: "Passwords do not match"
            },
        },
        errorLabelContainer: '#errors',
        wrapper:'li',
        submitHandler: function(form) {
            form.submit();
        }
});

});