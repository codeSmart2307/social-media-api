// (function() {
// Send API key in custom header in AJAX request
// $.ajax({
//     url: 'http://localhost:7700/',
//     beforeSend: (xhr) => {
//         xhr.setRequestHeader('x-auth-key', 'djfkcysl4d5s8wjd');
//     }
// })
// })();

// $(document).ready(function() {
//     $.ajax({
//         url: 'http://localhost:7700/',
//         // beforeSend: (xhr) => {
//         //     xhr.sendRequestHeader('x-auth-key', 'djfkcysl4d5s8wjd');
//         // },
//         headers: {
//             'x-auth-key':  'djfkcysl4d5s8wjd'
//         },
//         success: function(data) {
//             console.log(data);
//             }
//     })
//  });

//  $(document).ajaxSend(function(event, jqXHR, ajaxOptions) {
//     jqXHR.setRequestHeader('x-auth-key', 'djfkcysl4d5s8wjd');
// });

// fetch("http://localhost:7700/", {
//     headers: {
//         "x-auth-key":  "djfkcysl4d5s8wjd"
// }}).then((data) => {
//     console.log(data);
// }).catch(e);

// (function() {
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', 'http://localhost:7700/', true);
//     xhr.setRequestHeader('x-auth-key', 'djfkcysl4d5s8wjd');
//     xhr.send(null);
// })();
