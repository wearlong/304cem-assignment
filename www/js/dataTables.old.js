Vue.component('ItemTable',{
 template:'\
 <div class="row">\
 <table :id="this.id" class="table table-striped table-bordered">\
  <!--<DataTableHeader :headerArr="headerArr"></DataTableHeader>-->\
  <!--<DataTableBody :data="this.tableData"></DataTableBody>-->\
  <!--<DataTableFooter :footerArr="headerArr"></DataTableFooter>-->\
 </table>\
 <button type="button" class="btn btn-secondary" @click="refresh">Refresh</button>\
 </div>\
 ',
 props: [],
 data: function(){
  return{
   id: "ItemTable",
   headerArr: [
    { title: "itemCode"},
    { title: "Name"},
    { title: "Size"},
    {title: "Weight"},
    { title: "Category"}
   ],
   tableData: [],
   refresh: function(){
     eventHub.$emit('DataRefresh_Item');
   }
  };
 },
 computed:{},
 created:function(){

 },
 mounted: function(){
  let here = this;
  eventHub.$on('clearData', function(){ here.tableData = [];})
  eventHub.$on('DataRefresh_Item', function(){
   let dataSet = [];
   $.ajax({
    url: '/items',
    method: 'GET',
    success: function(result){
     if(result instanceof Array)
      here.tableData = [];
      result.forEach((v, i)=>{
        let item = {
          itemCode: v.itemCode,
          Name: v.name,
          Size: v.height + "cm x " + v.width + "cm x " + v.width + "cm",
          Weight: v.weight + "g",
          Category: v.category
        };
        //here.tableData.push(item);
        dataSet.push([
          item.itemCode, item.Name, item.Size, item.Weight, item.Category
        ]);
      });
      if($.fn.dataTable.isDataTable('#'+here.id)){
      here.table.destroy();
      }
      here.table = $('#'+here.id).DataTable({
        data: dataSet,
        columns: here.headerArr
      });
    }
   });
  });
  eventHub.$emit('DataRefresh_Item');
 }
});

Vue.component('DataTableHeader',{
 template:'\
 <thead>\
  <tr>\
   <th v-for=" header.title in headerArr">\
    {{header}}\
   </th>\
  </tr>\
 </thead>\
 ',
 props: ['headerArr'],
 data:function(){
  return{};
 },
 computed:{},
 created: function(){
 },
 mounted: function(){
 }
});

Vue.component('DataTableBody',{
 template:'\
 <tbody v-if="data.length>0">\
  <tr v-for="arr in data">\
   <td v-for="field in arr">{{field}}</td>\
  </tr>\
 </tbody>\
 <tbody v-else>\
  <tr>\
  <td :colspan="this.cols" class="text-center">No data is found</td>\
  </tr>\
 </tbody>\
 ',
 props: ['data'],
 data:function(){
  return{
   cols: this.$parent.headerArr.length,
   emptyMessage: "No data is found"
  };
 },
 computed:{
 },
 created: function(){
 },
 mounted: function(){
 }
});

Vue.component('DataTableFooter',{
 template:'\
 <tfoot>\
  <tr>\
   <th v-for=" footer in footerArr">\
    {{footer.title}}\
   </th>\
  </tr>\
 </tfoot>\
 ',
 props: ['footerArr'],
 data:function(){
  return{};
 },
 computed:{},
 created: function(){
 },
 mounted: function(){
 }
});