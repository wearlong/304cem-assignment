// Base header component
Vue.component('header-nav',{
  template: '\
  <nav class="navbar navbar-default shadow">\
   <div class="container-fluid">\
    <headUser v-if="this.loginData.auth" ></headUser>\
    <headLogin v-else></headLogin>\
    <userModal></userModal>\
   </div>\
  </nav>\
  ',
  props: [],
  data: function(){
   return {
    loginData: eventHub.loginData
   };
  },
  computed: {},
  created: function(){},
  mounted: function(){
    let here = this;
    eventHub.$on('isLogin', function(){
     $.ajax({
       url: '/users/isLogin',
       method: 'GET',
       success: function(result){
         // Initialize login data
         eventHub.loginData.auth = result.result;
         eventHub.loginData.username = result.username;
         eventHub.loginData.fullname = result.fullname;
       }
     });
    });

   // Emit once at the beginning
   eventHub.$emit('isLogin');
   eventHub.$on('logout',function(){
   $.ajax({
     url: '/users/logout',
     method: 'GET',
     success: function(result){
       // Refresh login data
       eventHub.$emit('isLogin');
     }
   })
   });
  }
 });

// Interface of not login
Vue.component('headLogin',{
 template: '\
 <div class="navbar-header pt-2">\
   <p class="navbar-text">Welcome to {{this.$root.systemName}}</p>\
   <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#userModal" @click="signIn">Sign in</button>\
   <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#userModal" @click="register">Register</button>\
 </div>\
 ',
 props: [],
 data: function(){
  return{
   signIn: function(){
    // Emit sign in modal settings
    eventHub.$emit('signInModal');
   },
   register: function(){
    // Emit register model settings
    eventHub.$emit('registerModal');
   }
  }
 },
 computed: {},
 created: function(){},
 mounted: function(){
 }
});

// Interface for already login
Vue.component('headUser',{
 template: '\
 <div class="navbar-header">\
  <p class="navbar-text">Welcome <span class="text-primary">{{this.loginData.fullname}}</span></p>\
  <button type="button" class="btn btn-danger" @click="logout">Logout</button>\
 </div>\
 ',
 props: [],
 data: function(){
  return {
   // Initialize login data
   loginData: eventHub.loginData
  };
 },
 methods:{
  logout: function(){
    // emit logout
    eventHub.$emit('logout');
   }
 },
 computed: {},
 created: function(){},
 mounted: function(){}
});

// modal base for login or register
Vue.component('userModal', {
 template: '\
 <div id="userModal" class="modal" abindex="-1" role="dialog" aria-hidden="true">\
  <div class="modal-dialog" role="document">\
   <loginForm v-if="this.login"></loginForm>\
   <registerForm v-if="this.register"></registerForm>\
  </div>\
 </div>\
 ',
 props: [],
 data: function(){
  return {
   // toggle of screen
   login: true,
   register: false
  };
 },
 computed: {},
 created: function(){},
 mounted: function(){
  let here = this;
  eventHub.$on('signInModal', function(){
   // Change toggle to show login modal
   here.$data.login = true;
   here.$data.register = false;
  });
  eventHub.$on('registerModal', function(){
   // Change toggle to show register modal
   here.$data.login = false;
   here.$data.register = true;
  });
  eventHub.$on('closeUserModal', function(){
    // hide modal interface
    $('#userModal').modal('hide');
  })
 }
});

// Login Form
// login_username, login_pwd
// loginSubmit()
Vue.component('loginForm', {
 template:'\
  <div class="modal-content">\
   <div class="modal-header text-center bg-primary">\
    <h4 class="modal-title w-100 font-weight-bold">Sign in</h4>\
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
     <span aria-hidden="true">&times;</span>\
    </button>\
   </div>\
   <div class="modal-body mx-3">\
    <div class="row">\
      <div class="col-md-6">\
        <div class="form-group">\
          <input id="login_username" type="text" class="form-control" placeholder="Your User Name *" required />\
        </div>\
      </div>\
      <div class="col-md-6">\
        <div class="form-group">\
          <input id="login_pwd" type="password" class="form-control" placeholder="Your Password *" required />\
        </div>\
      </div>\
    </div>\
    <div id="login_reCAPTCHA"></div>\
    <div class="text-center">\
     <button type="button" class="btnSubmit" @click="loginSubmit" >Login</button>\
    </div>\
   </div>\
   <div class="modal-footer d-flex justify-content-center bg-secondary">\
   </div>\
  </div>\
 ',
 props: [],
 data: function(){
   return{
     verified: false
   }
 },
 methods: {
  loginSubmit: function(){
    // emit login submit
    eventHub.$emit('logSubmit');
  }
 },
 computed: {},
 created: function(){},
 mounted: function(){
   let here = this;
   eventHub.$on('login_reCAPTCHA', function(){
    // reCAPTCHA succeed
    here.verified = true;
   });
   eventHub.$on('logSubmit', function(){
    if(here.verified){ // if reCAPTCHA succeed
      let formInput = {
        "username" : $('#login_username').val(),
        "pwd": $('#login_pwd').val()
      };
      $.ajax({
        method: "GET",
        url: "/users/login/"+formInput.username+"/"+formInput.pwd,
        success: function(result){
          if(result.result){
            // login successfully
            // clear form input
            $('#login_username').val('');
            $('#login_pwd').val('');
            // refresh login data
            eventHub.$emit('isLogin');
            // close modal
            eventHub.$emit('closeUserModal');
            // reset reCAPTCHA verification
            here.verified = false;
            grecaptcha.reset(login_checkbox);
          } else {
            // login failed
            alert('Login failed');
            // reset reCAPTCHA verification
            here.verified = false;
            grecaptcha.reset(login_checkbox);
          }
        }
      });
    } else {
      alert('You must verified');
    }
   });
 }, 
});

// Register form
// reg_username, reg_dob, reg_firstName, reg_lastName, reg_pwd, reg_cpwd
// regSubmit()
Vue.component('registerForm',{
 template:'\
  <div class="modal-content">\
   <div class="modal-header text-center bg-primary">\
    <h4 class="modal-title w-100 font-weight-bold">Register Here</h4>\
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
     <span aria-hidden="true">&times;</span>\
    </button>\
   </div>\
  <div class="modal-body mx-3">\
    <div class="row">\
    <div class="col-md-6">\
        <div class="form-group">\
          <input id="reg_username" type="text" class="form-control" placeholder="Your User Name *" required/>\
        </div>\
        <div class="form-group">\
          <input id="reg_dob" type="date" class="form-control" placeholder="Date Of Birth(DD-MM-YYYY) *" v-model="today" />\
        </div>\
      </div>\
      <div class="col-md-6">\
      <div class="form-group">\
        <input id="reg_firstName" type="text" class="form-control" placeholder="Your First Name *" required/>\
      </div>\
        <div class="form-group">\
          <input id="reg_lastName" type="text" class="form-control" placeholder="Your Last Name *" required/>\
        </div>\
      </div>\
      <div class="col-md-6">\
        <div class="form-group">\
          <input id="reg_pwd" type="password" class="form-control" placeholder="Your Password *" required/>\
        </div>\
      </div>\
      <div class="col-md-6">\
        <div class="form-group">\
          <input id="reg_cpwd" type="password" class="form-control" placeholder="Confirm Password *" required/>\
        </div>\
      </div>\
      </div>\
    <div id="register_reCAPTCHA"></div>\
    <div class="text-center">\
      <button type="button" class="btnSubmit" @click="regSubmit" >Register</button>\
    </div>\
   </div>\
   <div class="modal-footer d-flex justify-content-center bg-secondary">\
   </div>\
  </div>\
 ',
 props: [],
 computed: {
 },
 data: function(){
   return {
   }
 },
 methods: {
  regSubmit: function(){
    // Emit register Submit
    eventHub.$emit('regSubmit');
  }
 },
 created: function(){
  // Initialize today value
  let d = new Date();
  let todayString = d.getFullYear() + "-" + 
    ((d.getMonth()+1) < 10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1) )  + "-" + 
    (d.getDate() < 10 ? "0" + d.getDate() : d.getDate() );
  this.today = todayString;
 },
 mounted: function(){
  let here = this;
  // Define regSubmit
  eventHub.$on('regSubmit', function(){
    let checking = {
      username: false,
      dob: false,
      pwd: false
    };
    let forminput = {
      "username": $('#reg_username').val(),
      "firstName": $('#reg_firstName').val(),
      "lastName": $('#reg_lastName').val(),
      "dob": $('#reg_dob').val(),
      "pwd": $('#reg_pwd').val()
    }
    // Check User Name
    $.ajax({
      method: "GET",
      url: "/users/checkUser/" + forminput.username,
      success: function(result){
        if(result.result){
          // username duplicated
          alert(`${forminput.username} is alreay existed`);
        } else {
          checking.username = true;
          // Check Date of Birth
          checking.dob = true;

          // Check Password
          checking.pwd = forminput.pwd == $('#reg_cpwd').val();
          //console.log(checking);
          if(checking.username && checking.dob && checking.pwd){
            $.ajax({
              method: 'POST',
              url: '/users/register',
              data: forminput,
              success: function(result){
                if(result.result){
                  $('#reg_username').val('');
                  $('#reg_firstName').val('');
                  $('#reg_lastName').val('');
                  $('#reg_dob').val(here.today);
                  $('#reg_pwd').val('');
                  $('#reg_cpwd').val('');
                  eventHub.$emit('isLogin');
                  eventHub.$emit('closeUserModal');
                } else {
                  alert("Registration Error! Please try again!");
                }
              }
            });
          } else if(!checking.pwd) {
            alert('Password and Confirm Password are not the same');
          }
        }
      }
    });
  });
 }
});