Vue.config.devtools = true;

// global object to store event emitters
const eventHub = new Vue({
  data: function(){
    return {
      loginData: {auth: false},
      wareHouseData: [],
      itemData: []
    };
  },
  mounted: function(){
  }
});

// the main content of the page
// Tab of storage, warehouse and item
// with dataTables and CRUD panel
Vue.component('main-body',{
 template: '\
 <div class="container-fluid">\
  <ul class="nav nav-tabs" id="tableTable" role="tablist">\
    <li class="nav-item">\
      <a class="nav-link active" id="storage-tab" data-toggle="tab" href="#storage" role="tab" aria-controls="storage" aria-selected="true">Storages</a>\
    </li>\
    <li class="nav-item">\
      <a class="nav-link" id="warehouse-tab" data-toggle="tab" href="#warehouse" role="tab" aria-controls="warehouse" aria-selected="false">WareHouses</a>\
    </li>\
    <li class="nav-item">\
      <a class="nav-link" id="item-tab" data-toggle="tab" href="#item" role="tab" aria-controls="item" aria-selected="false">Items</a>\
    </li>\
  </ul>\
  <div class="tab-content" id="myTabContent">\
    <div class="tab-pane fade show active" id="storage" role="tabpanel" aria-labelledby="storage-tab">\
      <div class="row">\
        <div :class="dataTables.Storage.mainClass" >\
          <DataTable :info="this.dataTables.Storage.id" :eventId="\'Storage\'"></DataTable>\
        </div>\
        <div :class="dataTables.Storage.sideClass" v-if="this.loginData.auth">\
          <StoragePanel v-if="dataTables.Storage.sideToggle"></StoragePanel>\
          <div class="w-100 h-100 panelToggle" @click="storagePanelToggle" v-else></div>\
        </div>\
      </div>\
    </div>\
    <div class="tab-pane fade" id="warehouse" role="tabpanel" aria-labelledby="warehouse-tab">\
      <div class="row">\
        <div :class="dataTables.WareHouse.mainClass" >\
          <DataTable :info="this.dataTables.WareHouse.id" :eventId="\'WareHouse\'"></DataTable>\
        </div>\
        <div :class="dataTables.WareHouse.sideClass" v-if="this.loginData.auth">\
          <WareHousePanel v-if="dataTables.WareHouse.sideToggle"></WareHousePanel>\
          <div class="w-100 h-100 panelToggle" @click="wareHousePanelToggle" v-else></div>\
        </div>\
      </div>\
    </div>\
    <div class="tab-pane fade" id="item" role="tabpanel" aria-labelledby="item-tab">\
      <div class="row">\
        <div :class="dataTables.Item.mainClass">\
          <DataTable :info="this.dataTables.Item.id" :eventId="\'Item\'"></DataTable>\
        </div>\
        <div :class="dataTables.Item.sideClass" v-if="this.loginData.auth">\
          <ItemPanel v-if="dataTables.Item.sideToggle"></ItemPanel>\
          <div class="w-100 h-100 panelToggle" @click="itemPanelToggle" v-else></div>\
        </div>\
      </div>\
    </div>\
  </div>\
 </div>\
 ',
 props: [],
 data: function(){
   return{
     systemData: null,
     loginData: eventHub.loginData, // login data to check login status
     dataTables:{
       // Storage tab variables
       "Storage" :{
         id: "DataTableStorage",
         mainClass: "col-md-11",
         sideClass: "col-md-1",
         sideToggle: false,
         columns: [
           {title : "Code"},
           {title : "Item"},
           {title : "Location"},
           {title : "Quantity"},
           {title : "Remark"}
         ],
         table: null
       },
       // WareHouse tab variables
       "WareHouse" : {
        id: "DataTableWareHouse",
        mainClass: "col-md-11",
        sideClass: "col-md-1",
        sideToggle: false,
        columns: [
          { title: "Code"},
          { title: "Name"},
          { title: "Size"},
          { title: "Address"},
          { title: "Description"}
        ],
        table: null
       },
       // Item tab variables
       "Item" : {
        id: "DataTableItem",
        mainClass: "col-md-11",
        sideClass: "col-md-1",
        sideToggle: false,
        columns: [
          { title: "ItemCode"},
          { title: "Name"},
          { title: "Size"},
          { title: "Weight"},
          { title: "Category"}
        ],
        table: null
       }
     }
   }
 },
 methods: {
  storagePanelToggle: function(){
    // change the width of CRUD panel and datatables
    this.dataTables.Storage.mainClass = "col-md-8";
    this.dataTables.Storage.sideClass = "col-md-4";
    this.dataTables.Storage.sideToggle = true;
  },
  wareHousePanelToggle: function(){
    // change the width of CRUD panel and datatables
    this.dataTables.WareHouse.mainClass = "col-md-8";
    this.dataTables.WareHouse.sideClass = "col-md-4";
    this.dataTables.WareHouse.sideToggle = true;
  },
  itemPanelToggle: function(){
    // change the width of CRUD panel and datatables
    this.dataTables.Item.mainClass = "col-md-7";
    this.dataTables.Item.sideClass = "col-md-5";
    this.dataTables.Item.sideToggle = true;
  }
 },
 computed: {},
 created:function(){
   let here = this;
   // constant variable of warehouse sizes
   $.ajax({
    url: '/wareHouses/size',
    method: 'GET',
    success: function(result){
      here.size = result;
    }
   });
 },
 mounted: function(){
  let here = this;
  // Refresh Datatable of storage
  eventHub.$on('DataRefresh_Storage', function(){
    let dataSet = [];
    $.ajax({
      url: '/storages',
      method: 'GET',
      success: function(result){
        if(result.data instanceof Array){
          result.data.forEach((v, i) => {
            // Initialize columns
            let storage = {
              Code: v.recordCode,
              Item: v.stock.name,
              Location: v.location.name,
              Count: v.count,
              Remark: v.remark
            };
            // Add into data array
            dataSet.push([
              storage.Code, storage.Item, storage.Location, storage.Count, storage.Remark
            ]);
            // Check dataTables existed
            // If true, remove the old datatable
            if($.fn.dataTable.isDataTable('#'+here.dataTables.Storage.id)){
              here.dataTables.Storage.table.destroy();
             }
            // Build datatables with data array and columns
             here.dataTables.Storage.table = $('#'+here.dataTables.Storage.id).DataTable({
               data: dataSet,
               columns: here.dataTables.Storage.columns
             });
             // Prevent wrong width
             $('.dataTable').css('width', '100%');
          });
        }
      }
    }); // Ajax End
  });
  // Refresh Datatable of warehouse
  eventHub.$on('DataRefresh_WareHouse', function(){
    let dataSet = [];
    let nameSet = [];
    $.ajax({
      url: '/wareHouses',
      method: 'GET',
      success: function(result){
        if(result.data instanceof Array){
          result.data.forEach((v, i)=>{
            // Initialize columns
            let wareHouse = {
              Code: v.code,
              Name: v.name,
              Size: here.size[v.size],
              Address: v.address,
              Description: v.description
            };
            // Add into code name array
            nameSet.push({
              code: wareHouse.Code,
              name: wareHouse.Name
            });
            // Add into data array
            dataSet.push([
              wareHouse.Code, wareHouse.Name, wareHouse.Size, wareHouse.Address, wareHouse.Description
            ]);
          });
          // Initialize global code name array
          eventHub.wareHouseData = nameSet;
          // Check dataTables existed
          // If true, remove the old datatable
          if($.fn.dataTable.isDataTable('#'+here.dataTables.WareHouse.id)){
            here.dataTables.WareHouse.table.destroy();
           }
          // Build datatables with data array and columns
          here.dataTables.WareHouse.table = $('#'+here.dataTables.WareHouse.id).DataTable({
            data: dataSet,
            columns: here.dataTables.WareHouse.columns
          });
          // Prevent wrong width
          $('.dataTable').css('width', '100%');
        }
      }
    });
  });
  // Refresh datatables of Item
  eventHub.$on('DataRefresh_Item', function(){
    let dataSet = [];
    let nameSet = [];
    $.ajax({
     url: '/items',
     method: 'GET',
     success: function(result){
      if(result instanceof Array){
        result.forEach((v, i)=>{
          // Initialize columns
          let item = {
            itemCode: v.itemCode,
            Name: v.name,
            Size: v.height + "cm x " + v.width + "cm x " + v.width + "cm",
            Weight: v.weight + "g",
            Category: v.category
          };
          // Add into code name array
          nameSet.push({
            code: item.itemCode,
            name: item.Name
          });
          // Add into data array
          dataSet.push([
            item.itemCode, item.Name, item.Size, item.Weight, item.Category
          ]);
        });
        // Initialize global code name array
        eventHub.itemData = nameSet;
        // Check dataTables existed
        // If true, remove the old datatable
        if($.fn.dataTable.isDataTable('#'+here.dataTables.Item.id)){
        here.dataTables.Item.table.destroy();
        }
        // Build datatables with data array and columns
        here.dataTables.Item.table = $('#'+here.dataTables.Item.id).DataTable({
          data: dataSet,
          columns: here.dataTables.Item.columns
        });
        // Prevent wrong width
        $('.dataTable').css('width', '100%');
      }
     }
    });
   });

   // Emit once at the beginning
   eventHub.$emit('DataRefresh_Storage');
   eventHub.$emit('DataRefresh_WareHouse');
   eventHub.$emit('DataRefresh_Item');
 }
});

