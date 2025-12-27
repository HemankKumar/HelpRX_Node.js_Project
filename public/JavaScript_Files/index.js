// ================= DARK MODE =================
document.addEventListener("DOMContentLoaded", function () {

  const toggleBtn = document.getElementById("darkToggle");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggleBtn.innerText = "☀️";
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      toggleBtn.innerText = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      toggleBtn.innerText = "🌙";
    }
  });

});

// ================= PASSWORD TOGGLE =================
function togglePassword(id, icon) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("bi-eye-slash", "bi-eye");
  } else {
    input.type = "password";
    icon.classList.replace("bi-eye", "bi-eye-slash");
  }
}



// ================= SIGNUP =================
$("#dosub").click(function () {

  let email = $("#txtmailS").val();
  let pwd   = $("#txtpwdS").val();
  let type  = $("#comboCityS").val();

  // BASIC VALIDATION
  if(email === "" || pwd.length < 6 || type === ""){
    $("#sp").html("❌ Fill all fields correctly").css("color","red");
    return;
  }

  $.ajax({
    type: "get",
    url: "/signup",
    data: {
      kuchemail: email,
      kuchpass: pwd,
      kuchtype: type
    }
  })
  .done(function (resp) {

    if(resp.includes("Record Saved")){
      
      // ✅ SHOW SUCCESS ANIMATION
      $("#signupSuccess").removeClass("d-none");
      $("#sp").html("");

      // ✅ AUTO LOGIN
      localStorage.setItem("activeKuch", email);
      localStorage.setItem("userType", type);

      // ⏳ SHORT DELAY → REDIRECT
      setTimeout(() => {
        if(type === "Donor")
          location.href = "dash-donor.html";
        else
          location.href = "dash-needy.html";
      }, 1800);

    }
    else{
      $("#sp").html(resp).css("color","red");
    }
  })
  .fail(function (err) {
    $("#sp").html("Server Error").css("color","red");
  });

});



// ================= LOGIN =================
$("#dosubL").click(function(){

  let email = $("#txtmailL").val();
  let pass  = $("#txtpwdL").val();

  if(email=="" || pass==""){
    $(".modal-content").addClass("shake");
    setTimeout(()=>$(".modal-content").removeClass("shake"),400);
    return;
  }

  // Show loading
  $("#dosubL").prop("disabled",true).text("Please wait...");
  $("#loginAnim").removeClass("d-none");

  $.ajax({
    type:"get",
    url:"/Login",
    data:{
      kuchemail: email,
      kuchpass: pass
    }
  })
  .done(function(resp){

    $("#loginAnim").addClass("d-none");

    if(resp=="Invalid User Id/Password" || resp=="U R Blocked"){
      $(".modal-content").addClass("shake");
      setTimeout(()=>$(".modal-content").removeClass("shake"),400);
      $("#dosubL").prop("disabled",false).text("Login");
      $("#spp").text(resp).css("color","red");
      return;
    }

    // Success animation
    $("#loginSuccess").removeClass("d-none");

    localStorage.setItem("activeKuch", email);

    setTimeout(()=>{
      location.href = resp=="Donor"
        ? "dash-donor.html"
        : resp=="Needy"
        ? "dash-needy.html"
        : "dash-admin.html";
    },1200);

  })
  .fail(function(){
    alert("Server error");
  });

});



// ================= FORGOT PASSWORD =================
function validateForgot() {
  if (!forgotEmail.value.includes("@")) {
    errForgot.style.display = "block";
  } else {
    errForgot.style.display = "none";
    alert("Password reset link sent!");
  }
}
