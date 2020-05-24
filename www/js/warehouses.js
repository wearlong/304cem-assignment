// CRUD Panel
// Tabs for insert, update, delete
Vue.component('WareHousePanel',{
 template: '\
 <div class="container-fluid bg-light">\
  <ul class="nav nav-tabs" id="WareHouseTable" role="tablist">\
    <li class="nav-item">\
      <a class="nav-link active" id="insertWareHouse-tab" data-toggle="tab" href="#insertWareHouse" role="tab" aria-controls="insertWareHouse" aria-selected="true">Insert</a>\
    </li>\
    <li class="nav-item">\
      <a class="nav-link" id="updateWareHouse-tab" data-toggle="tab" href="#updateWareHouse" role="tab" aria-controls="updateWareHouse" aria-selected="false">Update</a>\
    </li>\
    <li class="nav-item">\
      <a class="nav-link" id="deleteWareHouse-tab" data-toggle="tab" href="#deleteWareHouse" role="tab" aria-controls="deleteWareHouse" aria-selected="false">Delete</a>\
    </li>\
  </ul>\
  <div class="tab-content" id="WareHousePanelTab">\
      <div class="tab-pane fade show active" id="insertWareHouse" role="tabpanel" aria-labelledby="insertWareHouse-tab"><insert-warehouse-form></insert-warehouse-form></div>\
      <div class="tab-pane fade" id="updateWareHouse" role="tabpanel" aria-labelledby="updateWareHouse-tab"><update-warehouse-form></update-warehouse-form></div>\
      <div class="tab-pane fade" id="deleteWareHouse" role="tabpanel" aria-labelledby="deleteWareHouse-tab"><delete-warehouse-form></delete-warehouse-form></div>\
  </div>\
</div>\
 ',
  props: [],
  data: function(){
    return{}
  },
  computed:{},
  created: function(){},
  mounted: function(){
  }
});

// Insert Form
// insertWareHouse_code, insertWareHouse_name, insertWareHouse_address, insertWareHouse_size, insertWareHouse_description
// insertWareHouse()
Vue.component('insert-warehouse-form', {
  template: '\
  <div :id="this.id" class="container-fluid">\
    <div class="row">\
      <div class="col-md-6">\
        <div class="form-group">\
          <label for="insertWareHouse_code">Code</label>\
          <input type="text" id="insertWareHouse_code" class="form-control" placeholder="Code of WareHouse *"/>\
          <small id="wareHouseCodeHelp" class="form-text text-muted">WareHouse Code must be Unique</small>\
        </div>\
      </div>\
      <div class="col-md-6">\
        <div class="form-group">\
          <label for="insertWareHouse_name">Name</label>\
          <input type="text" id="insertWareHouse_name" class="form-control" placeholder="Name of WareHouse *"/>\
        </div>\
      </div>\
    </div>\
    <div class="row">\
      <div class="col-md-8">\
        <div class="form-group green-border-focus">\
          <label for="insertWareHouse_address">Address</label>\
          <textarea class="form-control" id="insertWareHouse_address" rows="3" placeholder="Address of WareHouse *"></textarea>\
        </div>\
      </div>\
      <div class="col-md-4">\
        <div class="form-group">\
          <label for="insertWareHouse_size">Size</label>\
          <select id="insertWareHouse_size" class="selectpicker">\
            <option v-for="(value, index) in size" :value="index">{{value}}</option>\
          </select>\
        </div>\
      </div>\
    </div>\
    <div class="row">\
      <div class="col-md-12">\
        <div class="form-group orange-border-focus">\
          <label for="insertWareHouse_description">Description</label>\
          <textarea class="form-control" id="insertWareHouse_description" rows="3" cols="50" placeholder="Description of WareHouse *"></textarea>\
        </div>\
      </div>\
    </div>\
    <div class="text-center col-md-12">\
      <button type="button" class="btn btn-primary" @click="insertWareHouse">Insert WareHouse</button>\
    </div>\
  </div>\
  ',
  props:[],
  computed: {},
  data: function(){
    return{
      // define element id and size array
      id: 'insertWareHouseForm',
      size: this.$parent.$parent.size
    }
  },
  methods: {
    insertWareHouse: function(){
      // get form input values as wareHouse Object
      let wareHouse = {
        code: $('#insertWareHouse_code').val(),
        name: $('#insertWareHouse_name').val(),
        size: $('#insertWareHouse_size option:selected').val(),
        address: $('#insertWareHouse_address').val(),
        description: $('#insertWareHouse_description').val()
      }
      $.ajax({
        url: '/wareHouses/checkCode/' + wareHouse.code,
        method: 'GET',
        success: function(result){
          if(!result.result){
            $.ajax({
              url: '/wareHouses/insert',
              method: 'POST',
              data: wareHouse,
              success: function(result){
                if(result.result){
                  alert(`WareHouse - ${wareHouse.code} has been created Successfully`);
                  // Refresh Datatable
                  eventHub.$emit('DataRefresh_WareHouse');
                } else {
                }
              }
            });
          } else {
            alert(`WareHouse Code - ${wareHouse.code} is already existed`);
          }
        }
      });
    }
  },
  created: function(){},
  mounted: function(){}
});

// Update Form
// updateWareHouse_code
// updateWareHouse_name, updateWareHouse_address, updateWareHouse_size, updateWareHouse_description
// updateWareHouse()
Vue.component('update-warehouse-form', {
  template: '\
  <div :id="this.id" class="container-fluid">\
    <div class="row">\
      <div class="col-md-6">\
        <div class="form-group">\
          <label for="updateWareHouse_code">Code</label>\
          <input type="text" id="updateWareHouse_code" class="form-control" placeholder="Code of WareHouse *" v-model="wareHouse.code"/>\
          <small id="wareHouseCodeHelp" class="form-text text-muted">WareHouse Code must be Existed</small>\
        </div>\
      </div>\
      <div class="col-md-6" v-if="this.allow">\
        <div class="form-group">\
          <label for="updateWareHouse_name">Name</label>\
          <input type="text" id="updateWareHouse_name" class="form-control" placeholder="Name of WareHouse *" v-model="wareHouse.name"/>\
        </div>\
      </div>\
    </div>\
    <div class="row" v-if="this.allow">\
      <div class="col-md-8">\
        <div class="form-group green-border-focus">\
          <label for="updateWareHouse_address">Address</label>\
          <textarea class="form-control" id="updateWareHouse_address" rows="3" placeholder="Address of WareHouse *" v-model="wareHouse.address"></textarea>\
        </div>\
      </div>\
      <div class="col-md-4">\
        <div class="form-group">\
          <label for="updateWareHouse_size">Size</label>\
          <select id="updateWareHouse_size" class="selectpicker" v-model="wareHouse.size">\
            <option v-for="(value, index) in size" :value="index">{{value}}</option>\
          </select>\
        </div>\
      </div>\
    </div>\
    <div class="row" v-if="this.allow">\
      <div class="col-md-12">\
        <div class="form-group orange-border-focus">\
          <label for="updateWareHouse_description">Description</label>\
          <textarea class="form-control" id="updateWareHouse_description" rows="3" cols="50" placeholder="Description of WareHouse *" v-model="wareHouse.description"></textarea>\
        </div>\
      </div>\
    </div>\
    <div class="text-center col-md-12">\
      <button type="button" class="btn btn-primary" @click="findWareHouse" v-if="!this.allow">Find WareHouse</button>\
      <button type="button" class="btn btn-primary" @click="updateWareHouse" v-if="this.allow">Update WareHouse</button>\
      <button type="button" class="btn btn-warning" @click="cancel" v-if="this.allow">Cancel</button>\
    </div>\
  </div>\
  ',
  props:[],
  computed: {},
  data: function(){
    return{
      // v-model bind form input
      id: 'updateWareHouseForm',
      size: this.$parent.$parent.size,
      wareHouse: {
        code: "",
        name: "",
        address: "",
        size: "",
        description: ""
      },
      allow: false
    }
  },
  methods: {
    findWareHouse: function(){
      // find wareHouse before update
      let code = this.wareHouse.code;
      let here = this;
      $.ajax({
        url: '/warehouses/find/' + code,
        method: "GET",
        success: function(result){
          if(result.result){
            // WareHouse Found & load value
            here.allow = true;
            let wareHouse = result.data;
            $('#updateWareHouse_code').attr('disabled', 'disabled');
            here.wareHouse.name = wareHouse.name;
            here.wareHouse.address = wareHouse.address;
            here.wareHouse.size = wareHouse.size;
            here.wareHouse.description = wareHouse.description;
          } else {
            alert(`WareHouse - ${code} is not existed`);
          }
        }
      }); // Ajax End
    },
    cancel: function(){
      // reset form
      this.allow = false;
      this.wareHouse.code = "";
      this.wareHouse.name = "";
      this.wareHouse.address = "";
      this.wareHouse.size = "";
      this.wareHouse.description = "";
      $('#updateWareHouse_code').removeAttr('disabled');
    },
    updateWareHouse: function(){
      let here = this;
      $.ajax({
        url: '/warehouses/update',
        method: "PUT",
        data: here.wareHouse, // send input data
        success: function(result){
          if(result.result){
            alert(`WareHouse - ${here.wareHouse.code} has been updated successfully`);
            here.cancel();
            eventHub.$emit('DataRefresh_WareHouse');
          } else {
            alert(`WareHouse - ${here.wareHouse.code} update error`);
          }
        }
      }); // Ajax End
    }
  },
  created: function(){},
  mounted: function(){}
});

// Delete Form
// deleteWareHouse_code
// deleteWareHouse()
Vue.component('delete-warehouse-form',{
  template: '\
  <div :id="this.id" class="container-fluid">\
    <div class="row">\
      <div class="col-md-6">\
        <div class="form-group">\
          <label for="deleteWareHouse_code">Code</label>\
          <input type="text" id="deleteWareHouse_code" class="form-control" placeholder="Code of WareHouse *"/>\
          <small id="wareHouseCodeHelp" class="form-text text-muted">WareHouse Code must be Existed</small>\
        </div>\
      </div>\
    </div>\
    <div class="text-center col-md-12">\
      <button type="button" class="btn btn-primary" @click="deleteWareHouse">Delete WareHouse</button>\
    </div>\
  </div>\
  ',
  props: [],
  data: function(){
    return{
      // element id
      id: "deleteWareHouseForm",
    }
  },
  methods:{
    deleteWareHouse: function(){
      let code = $('#deleteWareHouse_code').val();
      $.ajax({
        url: '/warehouses/' + code,
        method: 'delete',
        success: function(result){
          if(result.result){
            // delete success
            alert(`WareHouse - ${code} has been deleted successfully`);
            eventHub.$emit('DataRefresh_WareHouse');
          } else {
            // delete failed
            alert(`WareHouse - ${code} Deletion Failed`);
          }
        }
      }); // Ajax End
    }
  },
  computed:{},
  created: function(){},
  mounted: function(){
  }
});