// CRUD Panel
// tabs for insert, update, delete
Vue.component('StoragePanel',{
 template: '\
 <div class="container-fluid bg-light">\
  <ul class="nav nav-tabs" id="StorageTable" role="tablist">\
    <li class="nav-item">\
      <a class="nav-link active" id="insertStorage-tab" data-toggle="tab" href="#insertStorage" role="tab" aria-controls="insertStorage" aria-selected="true">Insert</a>\
    </li>\
    <li class="nav-item">\
      <a class="nav-link" id="updateStorage-tab" data-toggle="tab" href="#updateStorage" role="tab" aria-controls="updateStorage" aria-selected="false">Update</a>\
    </li>\
    <li class="nav-item">\
      <a class="nav-link" id="deleteStorage-tab" data-toggle="tab" href="#deleteStorage" role="tab" aria-controls="deleteStorage" aria-selected="false">Delete</a>\
    </li>\
  </ul>\
  <div class="tab-content" id="StoragePanelTab">\
      <div class="tab-pane fade show active" id="insertStorage" role="tabpanel" aria-labelledby="insertStorage-tab"><insert-storage-form></insert-storage-form></div>\
      <div class="tab-pane fade" id="updateStorage" role="tabpanel" aria-labelledby="updateStorage-tab"><update-storage-form></update-storage-form></div>\
      <div class="tab-pane fade" id="deleteStorage" role="tabpanel" aria-labelledby="deleteStorage-tab"><delete-storage-form></delete-storage-form></div>\
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
// insertStorage_location, insertStorage_stock, insertStorage_count, insert Storage_remark
// insertStorage()
Vue.component('insert-storage-form', {
 template: '\
 <div :id="this.id" class="container-fluid">\
   <div class="row">\
     <div class="col-md-6">\
       <div class="form-group">\
         <label for="insertStorage_location">Location</label>\
         <br/>\
         <select class="form-control" id="insertStorage_location" v-model="storage.location" class="selectpicker">\
          <option value="unknown">Please Select</option>\
          <option v-for="( wData ) in eventHub.wareHouseData" :value="wData.code">\
           {{wData.code}} - {{wData.name}}\
          </option>\
         </select>\
       </div>\
     </div>\
     <div class="col-md-6">\
       <div class="form-group">\
        <label for="insertStorage_stock">Stock</label>\
        <br/>\
        <select class="form-control" id="insertStorage_stock" v-model="storage.stock"  class="selectpicker">\
         <option value="unknown">Please Select</option>\
         <option v-for="(iData) in eventHub.itemData" :value="iData.code">\
          {{iData.code}} - {{iData.name}}\
         </option>\
        </select>\
       </div>\
     </div>\
   </div>\
   <div class="row">\
    <div class="col-md-6">\
     <div class="form-group">\
      <label for="insertStorage_count">Quantity</label>\
      <input class="form-control" type="number" min="1" id="insertStorage_count" placeholder="Quantity of Stock *" v-model="storage.count"/>\
     </div>\
     <div class="col-md-6"></div>\
    </div>\
   </div>\
   <div class="row">\
    <div class="col-md-12">\
     <div class="form-group">\
      <label for="insertStorage_remark">Remark</label>\
      <textarea class="form-control" rows="3" cols="50" id="insertStorage_remark" placeholder="Remark of Storage *" v-model="storage.remark" ></textarea>\
     </div>\
    </div>\
   </div>\
   <div class="text-center col-md-12">\
     <button type="button" class="btn btn-primary" @click="insertStorage">Insert Storage</button>\
   </div>\
 </div>\
 ',
 props:[],
 computed: {},
 data: function(){
   return{
     // v-model bind form input
     id: 'insertStorageForm',
     storage: {
      location: "unknown",
      stock: "unknown",
      count: "1",
      remark: ""
     }
   }
 },
 methods: {
   cancel: function(){
    // reset input
    let here = this;
    here.storage.location = "unknown";
    here.storage.stock = "unknown";
    here.storage.count = "1";
    here.remark = "";
   },
   insertStorage: function(){
    let here = this;
    // get input values
    let storage = here.storage;
    $.ajax({
     url: '/storages',
     method: 'POST',
     data: storage,
     success: function(result){
      if(result.result){
       alert(`Storage has been inserted`);
       here.cancel();
       eventHub.$emit('DataRefresh_Storage');
      } else {
       alert(`Storage insertion failed`);
      }
     }
    }); // Ajax End
   }
 },
 created: function(){},
 mounted: function(){}
});

// Update Form
// updateStorage_recordCode
// updateStorage_location, updateStrorage_stock, updateStorage_count, updateStorage_remark
// updateStorage()
Vue.component('update-storage-form', {
  template: '\
  <div :id="this.id" class="container-fluid">\
    <div class="row">\
      <div class="col-md-8">\
        <div class="form-group">\
          <label for="updateStorage_recordCode">Code</label>\
          <br />\
          <input type="text" class="form-control" id="updateStorage_recordCode" placeholder="Code of Storage *" v-model="storage.recordCode" />\
          <small id="storageCodeHelp" class="form-text text-muted">Storage Code must be Existed</small>\
        </div>\
      </div>\
    </div>\
    <div class="row" v-if="this.allow">\
      <div class="col-md-6">\
        <div class="form-group">\
          <label for="updateStorage_location">Location</label>\
          <br/>\
          <select class="form-control" id="updateStorage_location" v-model="storage.location" class="selectpicker">\
           <option value="unknown">Please Select</option>\
           <option v-for="( wData ) in eventHub.wareHouseData" :value="wData.code">\
            {{wData.code}} - {{wData.name}}\
           </option>\
          </select>\
        </div>\
      </div>\
      <div class="col-md-6">\
        <div class="form-group">\
         <label for="updateStorage_stock">Stock</label>\
         <br/>\
         <select class="form-control" id="updateStorage_stock" v-model="storage.stock"  class="selectpicker">\
          <option value="unknown">Please Select</option>\
          <option v-for="(iData) in eventHub.itemData" :value="iData.code">\
           {{iData.code}} - {{iData.name}}\
          </option>\
         </select>\
        </div>\
      </div>\
    </div>\
    <div class="row" v-if="this.allow">\
     <div class="col-md-6">\
      <div class="form-group">\
       <label for="updateStorage_count">Quantity</label>\
       <input type="number" class="form-control" min="1" id="updateStorage_count" placeholder="Quantity of Stock *" v-model="storage.count"/>\
      </div>\
      <div class="col-md-6"></div>\
     </div>\
    </div>\
    <div class="row" v-if="this.allow">\
     <div class="col-md-12">\
      <div class="form-group">\
       <label for="updateStorage_remark">Remark</label>\
       <textarea class="form-control" rows="3" cols="50" id="updateStorage_remark" placeholder="Remark of Storage *" v-model="storage.remark" ></textarea>\
      </div>\
     </div>\
    </div>\
    <div class="text-center col-md-12">\
      <button type="button" class="btn btn-primary" @click="findStorage" v-if="!this.allow">Find Storage</button>\
      <button type="button" class="btn btn-primary" @click="updateStorage" v-if="this.allow">Update Storage</button>\
      <button type="button" class="btn btn-warning" @click="cancel" v-if="this.allow">Cancel</button>\
    </div>\
  </div>\
  ',
  props:[],
  computed: {},
  data: function(){
    return{
      // v-model bind form input
      id: 'updateStorageForm',
      storage: {
       recordCode: "",
       location: "unknown",
       stock: "unknown",
       count: "1",
       remark: ""
      },
      allow: false
    }
  },
  methods: {
    cancel: function(){
     // reset input
     let here = this;
     here.storage.recordCode = "";
     here.storage.location = "unknown";
     here.storage.stock = "unknown";
     here.storage.count = "1";
     here.remark = "";
     here.allow = false;
     $('#updateStorage_recordCode').removeAttr('disabled');
    },
    findStorage: function(){
      // find storage before update
      let here = this;
      let code = this.storage.recordCode;
      $.ajax({
        url: '/storages/find/' + code,
        method: 'GET',
        success: function(result){
          if(result.result){
            // load value
            let storage = result.data;
            $('#updateStorage_recordCode').attr('disabled', 'disabled');
            here.storage.location = storage.location.code;
            here.storage.stock = storage.stock.itemCode;
            here.storage.count = storage.count;
            here.storage.remark = storage.remark;
            here.allow = true;
          } else {
            alert(`Storage (${code}) is not existed`);
          }
        }
      });
    },
    updateStorage: function(){
      let here = this;
      $.ajax({
        url: '/storages/update',
        method: "PUT",
        data: here.storage,
        success: function(result){
          if(result.result){
            alert(`Storage (${here.storage.recordCode}) has been updated successfully`);
            here.cancel();
            eventHub.$emit('DataRefresh_Storage');
          } else {
            alert(`Storage (${here.storage.recordCode}) update error`);
          }
        }
      })
    }
  },
  created: function(){},
  mounted: function(){}
 });

// Delete Form
// deleteStorage_recordCode
// deleteStorage()
Vue.component('delete-storage-form',{
  template: '\
  <div :id="this.id" class="container-fluid">\
    <div class="row">\
      <div class="col-md-6">\
        <div class="form-group">\
          <label for="deleteStorage_recordCode">Code</label>\
          <input type="text" id="deleteStorage_recordCode" class="form-control" placeholder="Code of Storage *"/>\
          <small id="storageCodeHelp" class="form-text text-muted">Storage Code must be Existed</small>\
        </div>\
      </div>\
    </div>\
    <div class="text-center col-md-12">\
      <button type="button" class="btn btn-primary" @click="deleteStorage">Delete Storage</button>\
    </div>\
  </div>\
  ',
  props: [],
  data: function(){
    return{
      id: "deleteStorageForm",
    }
  },
  methods:{
    deleteStorage: function(){
      let code = $('#deleteStorage_recordCode').val();
      $.ajax({
        url: '/storages/' + code,
        method: 'delete',
        success: function(result){
          if(result.result){
            // delete success
            alert(`Storage - ${code} has been deleted successfully`);
            eventHub.$emit('DataRefresh_Storage');
          } else {
            // delete failed
            alert(`Storage - ${code} Deletion Failed`);
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