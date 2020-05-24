// CRUD Panel
// Tabs for insert, update, delete
Vue.component('ItemPanel',{
 template: '\
 <div class="container-fluid bg-light">\
  <ul class="nav nav-tabs" id="itemPanelTable" role="tablist">\
    <li class="nav-item">\
      <a class="nav-link active" id="insertItem-tab" data-toggle="tab" href="#insertItem" role="tab" aria-controls="insertItem" aria-selected="true">Insert</a>\
    </li>\
    <li class="nav-item">\
      <a class="nav-link" id="updateItem-tab" data-toggle="tab" href="#updateItem" role="tab" aria-controls="updateItem" aria-selected="false">Update</a>\
    </li>\
    <li class="nav-item">\
      <a class="nav-link" id="deleteItem-tab" data-toggle="tab" href="#deleteItem" role="tab" aria-controls="deleteItem" aria-selected="false">Delete</a>\
    </li>\
  </ul>\
  <div class="tab-content" id="itemPanelTab">\
      <div class="tab-pane fade show active" id="insertItem" role="tabpanel" aria-labelledby="insertItem-tab"><insert-item-form></insert-item-form></div>\
      <div class="tab-pane fade" id="updateItem" role="tabpanel" aria-labelledby="updateItem-tab"><update-item-form></update-item-form></div>\
      <div class="tab-pane fade" id="deleteItem" role="tabpanel" aria-labelledby="deleteItem-tab"><delete-item-form></delete-item-form></div>\
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
// insertItem_itemCode, insertItem_name, insertItem_height, insertItem_width, insertItem_weight, insertItem_category
// insertItem()
Vue.component('insert-item-form',{
 template: '\
 <div :id="this.id" class="container-fluid">\
  <div class="row">\
    <div class="col-md-6">\
      <div class="form-group">\
        <label for="insertItem_itemCode">Item Code</label>\
        <input type="text" id="insertItem_itemCode" class="form-control" placeholder="Code of Item *"/>\
        <small id="itemCodeHelp" class="form-text text-muted">Item Code must be Unique</small>\
      </div>\
    </div>\
    <div class="col-md-6">\
      <div class="form-group">\
        <label for="insertItem_name">Name</label>\
        <input type="text" id="insertItem_name" class="form-control" placeholder="Name of Item *"/>\
      </div>\
    </div>\
  </div>\
  <div class="row">\
    <div class="col-md-6">\
      <div class="form-group">\
        <label for="insertItem_height">Height</label>\
        <input type="number" min="0" id="insertItem_height" class="form-control" placeholder="Height of Item (cm)*"/>\
      </div>\
    </div>\
    <div class="col-md-6">\
      <div class="form-group">\
        <label for="insertItem_width">Width</label>\
        <input type="numer" min="0" id="insertItem_width" class="form-control" placeholder="Width of Item (cm)*"/>\
      </div>\
    </div>\
  </div>\
  <div class="row">\
    <div class="col-md-6">\
      <div class="form-group">\
        <label for="insertItem_weight">Weight</label>\
        <input type="number" min="0" id="insertItem_weight" class="form-control" placeholder="Weight of Item (g)*"/>\
      </div>\
    </div>\
    <div class="col-md-6">\
      <div class="form-group">\
        <label for="insertItem_category">Category</label>\
        <input type="text" id="insertItem_category" class="form-control" placeholder="Category of Item *"/>\
      </div>\
    </div>\
  </div>\
  <div class="text-center col-md-12">\
    <button type="button" class="btn btn-primary" @click="insertItem">Insert Item</button>\
  </div>\
</div>\
 ',
 props:[],
 data: function(){
  return{
   // element id
   id: "insertItemForm"
  };
 },
 methods: {
  insertItem: function(){
    // checking for itemCode unique
    let checking = {
      itemCode: false
     };
     // Initialize input as item
     let item = {
      name: $('#insertItem_name').val(),
      itemCode: $('#insertItem_itemCode').val(),
      height: $('#insertItem_height').val(),
      width: $('#insertItem_width').val(),
      weight: $('#insertItem_weight').val(),
      category: $('#insertItem_category').val()
     };
     // Check itemCode unique
     $.ajax({
      url: '/items/checkCode/' + item.itemCode,
      method: 'GET',
      success: function(result){
       checking.itemCode = !result.result;
       if(checking.itemCode){
        // insert Item
        $.ajax({
         url: '/items/insert',
         method: 'POST',
         data: item,
         success: function(result){
          if(result){
           // insert succeed
           alert(`Item - ${item.itemCode} has been inserted successfully`);
           eventHub.$emit('DataRefresh_Item');
          }else{
           // insert failed
           alert(`Item - ${item.itemCode} insertion error`);
          }
         }
        }); // Ajax End
       } else {
        alert("The itemCode " + item.itemCode + " alreay existed"); 
       }
      }
     }); // Ajax End
  }
 },
 computed: {},
 created: function(){},
 mounted: function(){
 }
});

// Update Form
// updateItem_itemCode
// updateItem_name, updateItem_height, updateItem_width, updateItem_weight, updateItem_category
// updateItem()
Vue.component('update-item-form',{
  template: '\
  <div :id="this.id" class="container-fluid">\
    <div class="row">\
      <div class="col-md-6">\
        <div class="form-group">\
          <label for="updateItem_itemCode">Item Code</label>\
          <input type="text" id="updateItem_itemCode" class="form-control" placeholder="Code of Item *" v-model="item.itemId" />\
          <small id="itemCodeHelp" class="form-text text-muted">Item Code must be Existed</small>\
        </div>\
      </div>\
      <div class="col-md-6" v-if="this.allow">\
        <div class="form-group">\
          <label for="updateItem_name">Name</label>\
          <input type="text" id="updateItem_name" class="form-control" placeholder="Name of Item *" v-model="item.name"/>\
        </div>\
      </div>\
    </div>\
    <div class="row" v-if="this.allow">\
    <div class="col-md-6">\
      <div class="form-group">\
        <label for="updateItem_height">Height</label>\
        <input type="number" min="0" id="updateItem_height" class="form-control" placeholder="Height of Item (cm)*" v-model="item.height"/>\
      </div>\
    </div>\
    <div class="col-md-6">\
      <div class="form-group">\
        <label for="updateItem_width">Width</label>\
        <input type="numer" min="0" id="updateItem_width" class="form-control" placeholder="Width of Item (cm)*" v-model="item.width"/>\
      </div>\
    </div>\
  </div>\
  <div class="row" v-if="this.allow">\
    <div class="col-md-6">\
      <div class="form-group">\
        <label for="updateItem_name">Weight</label>\
        <input type="number" min="0" id="updateItem_weight" class="form-control" placeholder="Weight of Item (g)*" v-model="item.weight"/>\
      </div>\
    </div>\
    <div class="col-md-6" >\
      <div class="form-group">\
        <label for="updateItem_category">Category</label>\
        <input type="text" id="updateItem_category" class="form-control" placeholder="Category of Item *" v-model="item.category"/>\
      </div>\
    </div>\
  </div>\
    <div class="text-center col-md-12">\
      <button type="button" class="btn btn-primary" @click="findItem" v-if="!this.allow">Find Item</button>\
      <button type="button" class="btn btn-primary" @click="updateItem" v-if="this.allow">Update Item</button>\
      <button type="button" class="btn btn-warning" @click="cancel" v-if="this.allow">Cancel</button>\
    </div>\
  </div>\
  ',
  props: [],
  data: function(){
    return{
      // v-model bind inputs
      id: "updateItemForm",
      allow: false,
      item:{
        itemId: "",
        name: "",
        height: "",
        width: "",
        weight: "",
        category: ""
      }
    }
  },
  methods:{
    findItem: function(){
      let code = this.item.itemId;
      let here = this;
      $.ajax({
        url: '/items/find/' + code,
        method: 'GET',
        success: function(result){
          if(result.result){
            // Item Found
            here.allow = true;
            let item = result.data;
            $('#updateItem_itemCode').attr('disabled', 'disabled');
            here.item.name = item.name;
            here.item.height = item.height;
            here.item.width = item.width;
            here.item.weight = item.weight;
            here.item.category = item.category;
          } else {
            // Item not existed
            alert(`Item - ${code} is not existed`);
          }
        }
      }); // Ajax End
    },
    cancel: function(){
      // reset input
      this.allow = false;
      this.item.itemId = "";
      this.item.name = "";
      this.item.height = "";
      this.item.width = "";
      this.item.weight = "";
      this.item.category = "";
      $('#updateItem_itemCode').removeAttr('disabled');
    },
    updateItem: function(){
      let here = this;
      $.ajax({
        url: '/items/update',
        method: 'PUT',
        data: here.item,
        success: function(result){
          if(result.result){
            // Update Successfully
            alert(`Item - ${here.item.itemId} has been updated successfully`);
            here.cancel();
            eventHub.$emit('DataRefresh_Item');
          } else {
            // Update Failed
          }
        }
      });
    }
  },
  computed:{},
  created: function(){},
  mounted: function(){
  }
});

// Delete Form
// deleteItem_itemCode
// deleteItem()
Vue.component('delete-item-form',{
  template: '\
  <div :id="this.id" class="container-fluid">\
    <div class="row">\
      <div class="col-md-6">\
        <div class="form-group">\
          <label for="deleteItem_itemCode">Item Code</label>\
          <input type="text" id="deleteItem_itemCode" class="form-control" placeholder="Code of Item *"/>\
          <small id="itemCodeHelp" class="form-text text-muted">Item Code must be Existed</small>\
        </div>\
      </div>\
    </div>\
    <div class="text-center col-md-12">\
      <button type="button" class="btn btn-primary" @click="deleteItem">Delete Item</button>\
    </div>\
  </div>\
  ',
  props: [],
  data: function(){
    return{
      id: "deleteItemForm",
    }
  },
  methods:{
    deleteItem: function(){
      let itemCode = $('#deleteItem_itemCode').val();
      $.ajax({
        url: '/items/' + itemCode,
        method: 'delete',
        success: function(result){
          if(result.result){
            // delete success
            alert(`Item - ${itemCode} has been deleted successfully`);
            eventHub.$emit('DataRefresh_Item');
          } else {
            // delete failed
            alert(`Item - ${itemCode} Deletion Failed`);
          }
        }
      })
    }
  },
  computed:{},
  created: function(){},
  mounted: function(){
  }
});