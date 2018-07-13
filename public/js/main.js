var script = document.createElement('script');

script.src = '../bower_components/jquery/dist/jquery.js';
document.getElementsByTagName('head')[0].appendChild(script);

$(document).ready(() => {
    // on-click event of the delete button which is identified by the .delete-post class
    $('.delete-post').on('click', (e) => {
        $target = $(e.target);              // Setting an event variable
        const id = $target.attr('data-id'); // Capturing the data-id attribute
        console.log(id);
        // Sending an AJAX DELETE request to the DELETE route
        $.ajax({
            type: 'DELETE',
            url: '/posts/' + id,
            success: (res) => {
                alert('Deleting post: ' + res);
                window.location.href = '/';               
            },
            error: (err) => {
                console.log(err);
            }
        });
    });


    // on-submit event for the edit form
    $('#edit-form').submit((e) => {
        let form = $('edit-form')[0];
        let data =new FormData(form);

        $target_edit = $(e.target);
        const id = $target_edit.attr('data-id');
        let title = $('#title').val();
        let description = $('#description').val();

        $.ajax({
            type: 'PUT',
            url: 'http://localhost:7700/posts/' + id,
            // data: {
            //     title: title,
            //     description: description,
            // },
            data: data,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            success: (res) => {
                console.log('Editing post:' + res);
                window.location.href='/';
            },
            error: (err) => {
                console.log(err);
            }
        });
        e.preventDefault(); // Prevent default form submit action
    });
});


