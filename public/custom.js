(function ($) {
  "use strict";

  $(document).ready(function () {
    $("a[href='#']").on("click", function (e) {
      e.preventDefault();
    });

    /* ----------------------------------------------------------- */
    /*  FIXED HEADER ON SCROLL
    /* ----------------------------------------------------------- */

    var navsite = $("#site-navigation");
    if (navsite.length) {
      var offset = $("#site-navigation").offset().top;
    }
    $(document).scroll(function () {
      var scrollTop = $(document).scrollTop();
      if (scrollTop > offset) {
        $("#site-navigation").addClass("fixed-top");
      } else {
        $("#site-navigation").removeClass("fixed-top");
      }
    });

    /* ----------------------------------------------------------- */
    /*  ADD HEIGHT TO NAVBAR IN MOBILE DEVICES
    /* ----------------------------------------------------------- */

    $(".navbar-collapse").css({
      maxHeight: $(window).height() - $(".navbar-header").height() + "px",
    });

    /* ----------------------------------------------------------- */
    /*  REFRESH 503 PAGE
    /* ----------------------------------------------------------- */

    $("#refresh").on("click", function () {
      location.reload();
    });

    /* ----------------------------------------------------------- */
    /*  AJAX CONTACT FORM
    /* ----------------------------------------------------------- */

    $(".form-contact").on("submit", function () {
      $(".output_message").text("Loading...");

      var form = $(this);
      $.ajax({
        url: form.attr("action"),
        method: form.attr("method"),
        data: form.serialize(),
        success: function (result) {
          if (result == "success") {
            $(".form-contact")
              .find(".output_message_holder")
              .addClass("d-block");
            $(".form-contact")
              .find(".output_message")
              .addClass("success");
            $(".output_message").text(
              "Your message has been sent successfully!"
            );
          } else {
            $(".form-contact")
              .find(".output_message_holder")
              .addClass("d-block");
            $(".form-contact").find(".output_message").addClass("error");
            $(".output_message").text(
              "Error while Sending email! try later"
            );
          }
        },
      });

      return false;
    });


    $(document).on("submit", "#profitCalculate", function (e) {
      e.preventDefault();

      $.ajax({
        method:"POST",
        url:$(this).prop('action'),
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success:function(data)
        {
         if ((data.errors)) {
           $('.alert-success').hide();
           $('.alert-info').hide();
           $('.alert-danger').show();
           $('.alert-danger ul').html('');
           for (var error in data.errors) {
            $('.alert-danger p').html(data.errors[error]);
           }
         } else {
             console.log(data);
           $('.alert-info').hide();
           $('.alert-danger').hide();
           $('.profitCalBoxAmount').val(data);

         }

        $('#submit-btn').prop('disabled',false);

        }
      });
    });



    $(document).on("submit", "#contactform", function (e) {
      e.preventDefault();
      $(".gocover").show();
      $(".formSpin").css('display', 'inline-block');
      $("button.btn-contact").prop("disabled", true);
      $.ajax({
        method: "POST",
        url: $(this).prop("action"),
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
          if (data.errors) {
            $(".formSpin").css('display', 'none')
            $(".alert-success").hide();
            $(".alert-danger").show();
            $(".alert-danger ul").html("");
            for (var error in data.errors) {
              $(".alert-danger ul").append(
                "<li>" + data.errors[error] + "</li>"
              );
            }
            $(
              "#contactform input[type=text], #contactform input[type=email], #contactform textarea"
            )
              .eq(0)
              .focus();
          } else {
            $(".alert-danger").hide();
            $(".alert-success").show();
            $(".alert-success p").html(data);
            $.notify("Message Sent Successfully.", "success");
            $(
              "#contactform input[type=text], #contactform input[type=email], #contactform textarea"
            )
              .eq(0)
              .focus();
            $(
              "#contactform input[type=text], #contactform input[type=email], #contactform textarea"
            ).val("");
          }
          $(".formSpin").css('display', 'none')
          $(".gocover").hide();
          $("button.btn-contact").prop("disabled", false);
        },
      });
    });

    // LOGIN FORM

    $("#loginform").on("submit", function (e) {
      e.preventDefault();
      $("#loginform button.submit-btn").prop("disabled", true);
      $(".formSpin").css('display', 'inline-block');
      $("#loginform .alert-info").show();
      $("#loginform .alert-info p").html($("#authdata").val());

      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          email: $('#email').val(), 
          password: $('#password').val() 
        })
      })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.message); 
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.errors) {
          // Handle errors
          $(".formSpin").css('display', 'none');
          $("#loginform .alert-success").hide();
          $("#loginform .alert-info").hide();
          $("#loginform .alert-danger").show();
          $("#loginform .alert-danger ul").html("");
          for (var error in data.errors) {
            $("#loginform .alert-danger p").html(data.errors[error]);
          }
        } else {
          // Successful login
          $(".formSpin").css('display', 'none');
          $("#loginform .alert-info").hide();
          $("#loginform .alert-danger").hide();
          $("#loginform .alert-success").show();
          $("#loginform .alert-success p").html("Success !");
          window.location = data.redirectUrl; 
        }
        $("#loginform button.submit-btn").prop("disabled", false);
      })
      .catch(error => {
        
        $(".formSpin").css('display', 'none');
        $("#loginform button.submit-btn").prop(
          "disabled",
          false
        );
        console.error("Login Error:", error);
        $("#loginform .alert-danger").show();
        $("#loginform .alert-danger p").html("An error occurred during login. Please try again later.");
      });
    });

    // REGISTER FORM

    $("#registerform").on("submit", function (e) {
      e.preventDefault();

      $(".formSpin").css('display', 'inline-block');
      $("#registerform button.submit-btn").prop("disabled", true);
      $("#registerform .alert-info").show();
      $("#registerform .alert-info p").html($("#processdata").val());

      // $.ajax({
      //   method: "POST",
      //   url: "/register",
      //   data: new FormData(this),
      //   dataType: "JSON",
      //   contentType: false,
      //   cache: false,
      //   processData: false,
      //   success: function (data) {
      //     if (data == 1) {
      //       window.location = mainurl + "/dashboard";
      //     } else {
      //       if (data.errors) {
      //         $(".formSpin").css('display', 'none');
      //         $("#registerform .alert-success").hide();
      //         $("#registerform .alert-info").hide();
      //         $("#registerform .alert-danger").show();
      //         $("#registerform .alert-danger ul").html("");
      //         for (var error in data.errors) {
      //           $("#registerform .alert-danger p").html(
      //             data.errors[error]
      //           );
      //         }
      //         $("#registerform button.submit-btn").prop(
      //           "disabled",
      //           false
      //         );
      //       } else {
      //         $(".formSpin").css('display', 'none');
      //         $("#registerform .alert-info").hide();
      //         $("#registerform .alert-danger").hide();
      //         $("#registerform .alert-success").show();
      //         $("#registerform .alert-success p").html(data);
      //         $("#registerform button.submit-btn").prop(
      //           "disabled",
      //           false
      //         );
      //       }
      //     }
      //   },
      // });
      $("#registerform").on("submit", function (e) {
        e.preventDefault();

        $(".formSpin").css('display', 'inline-block');
        $("#registerform button.submit-btn").prop("disabled", true);
        $("#registerform .alert-info").show();
        $("#registerform .alert-info p").html($("#processdata").val());

        $("#registerform").on("submit", function (e) {
          e.preventDefault();

          $(".formSpin").css('display', 'inline-block');
          $("#registerform button.submit-btn").prop("disabled", true);
          $("#registerform .alert-info").show();
          $("#registerform .alert-info p").html($("#processdata").val());

          fetch('/register', {
            method: 'POST',
            body: new FormData(this)
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            if (data.success) { // Check for a 'success' property in the response
              window.location.href = mainurl + "/dashboard";
            } else {
              // console.log(data);
              if (data.errors) {
                $(".formSpin").css('display', 'none');
                $("#registerform .alert-success").hide();
                $("#registerform .alert-info").hide();
                $("#registerform .alert-danger").show();
                $("#registerform .alert-danger ul").html("");
                for (var error in data.errors) {
                  console.log(error);
                  $("#registerform .alert-danger p").html(
                    data.errors[error]
                  );
                }
                $("#registerform button.submit-btn").prop(
                  "disabled",
                  false
                );
              } else {
                // Handle other responses (e.g., display generic success message)
                $(".formSpin").css('display', 'none');
                $("#registerform .alert-info").hide();
                $("#registerform .alert-danger").hide();
                $("#registerform .alert-success").show();
                $("#registerform .alert-success p").html(data.message || "Registration Successful!");
                $("#registerform button.submit-btn").prop(
                  "disabled",
                  false
                );
              }
            }
          })
          .catch(error => {
            // Handle AJAX errors (e.g., network issues)
            $(".formSpin").css('display', 'none');
            $("#registerform button.submit-btn").prop(
              "disabled",
              false
            );
            console.error("Registration Error:", error);
            $("#registerform .alert-danger").show();
            $("#registerform .alert-danger p").html("An error occurred during registration. Please try again later.");
          });
        });
    });

    $("#forgotform").on("submit", function (e) {
      e.preventDefault();
      $(".formSpin").css('display', 'inline-block');
      $("button.submit-btn").prop("disabled", true);
      $(".alert-info").show();
      $(".alert-info p").html($(".authdata").val());
      $.ajax({
        method: "POST",
        url: $(this).prop("action"),
        data: new FormData(this),
        dataType: "JSON",
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
          if (data.errors) {
            $(".formSpin").css('display', 'none');
            $(".alert-success").hide();
            $(".alert-info").hide();
            $(".alert-danger").show();
            $(".alert-danger ul").html("");
            for (var error in data.errors) {
              $(".alert-danger p").html(data.errors[error]);
            }
          } else {
            $(".formSpin").css('display', 'none');
            $(".alert-info").hide();
            $(".alert-danger").hide();
            $(".alert-success").show();
            $(".alert-success p").html(data);
            $("input[type=email]").val("");
          }
          $("button.submit-btn").prop("disabled", false);
        },
      });
    });

    //  FORGOT FORM ENDS

    //  USER FORM SUBMIT SECTION

    $(document).on("submit", "#userform", function (e) {
      e.preventDefault();
      $(".gocover").show();
      $("button.submit-btn").prop("disabled", true);
      $.ajax({
        method: "POST",
        url: $(this).prop("action"),
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
          if (data.errors) {
            $(".alert-success").hide();
            $(".alert-danger").show();
            $(".alert-danger ul").html("");
            for (var error in data.errors) alert(error);
            {
              $(".alert-danger ul").append(
                "<li>" + data.errors[error] + "</li>"
              );
            }
            $(
              "#userform input[type=text], #userform input[type=email], #userform textarea"
            )
              .eq(0)
              .focus();
          } else {
            $(".alert-danger").hide();
            $(".alert-success").show();
            $(".alert-success p").html(data);
            $(
              "#userform input[type=text], #userform input[type=email], #userform textarea"
            )
              .eq(0)
              .focus();
          }
          $(".gocover").hide();
          $("button.submit-btn").prop("disabled", false);
        },
      });
    });

    // USER FORM SUBMIT SECTION ENDS

    // MESSAGE FORM

    $(document).on("submit", "#messageform", function (e) {
      e.preventDefault();
      var href = $(this).data("href");
      $(".gocover").show();
      $("button.mybtn1").prop("disabled", true);
      $.ajax({
        method: "POST",
        url: $(this).prop("action"),
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
          if (data.errors) {
            $(".alert-success").hide();
            $(".alert-danger").show();
            $(".alert-danger ul").html("");
            for (var error in data.errors) {
              $(".alert-danger ul").append(
                "<li>" + data.errors[error] + "</li>"
              );
            }
            $("#messageform textarea").val("");
          } else {
            $(".alert-danger").hide();
            $(".alert-success").show();
            $(".alert-success p").html(data);
            $("#messageform textarea").val("");
            $("#messages").load(href);
          }
          $(".gocover").hide();
          $("button.mybtn1").prop("disabled", false);
        },
      });
    });

    // MESSAGE FORM ENDS

    $(document).on('submit','#simpleform',function(e){
      e.preventDefault();

        $.ajax({
         method:"POST",
         url:$(this).prop('action'),
         data:new FormData(this),
         dataType:'JSON',
         contentType: false,
         cache: false,
         processData: false,
         success:function(data)
         {
          if ((data.errors)) {
            for(var error in data.errors)
            {
            $.notify(data.errors[error],"warn");
            }
          }
          else
          {
            $.notify(data.message,data.type);
          }
         }

        });
      })

    // Currency and Language Section

    $(".selectors").on("change", function () {
      var url = $(this).val();
      window.location = url;
    });

    $(".upload").on("change", function () {
      var imgpath = $(this).parent().find("img");
      var file = $(this);
      readURL(this, imgpath);
    });

    function readURL(input, imgpath) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          imgpath.attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
      }
    }

    $(".image-upload").on( "change", function() {
      var imgpath = $(this).parent().prev();
      var file = $(this);
      readURL(this,imgpath);
      });

      function readURL(input,imgpath) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
        imgpath.css('background', 'url('+e.target.result+')');
        }
        reader.readAsDataURL(input.files[0]);
      }
    }
    // IMAGE UPLOADING ENDS :)

    //**************************** GLOBAL CAPCHA****************************************

    $(".refresh_code").on("click", function () {
      $.get($(this).data("href"), function (data, status) {
        $(".codeimg").attr(
          "src",
          "" +
            mainurl +
            "/assets/images/capcha_code.png?time=" +
            Math.random()
        );
      });
    });
  });
  /* ----------------------------------------------------------- */
})(jQuery);