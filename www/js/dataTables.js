// Datatable component
Vue.component('DataTable',{
  template:'\
  <table :id="this.info" class="table table-striped table-bordered">\
  </table>\
  <button type="button" class="btn btn-secondary" @click="refresh">Refresh</button>\
  ',
  props: ['info','eventId'],
  data: function(){
   return{
   };
  },
  methods:{
    refresh: function(){
      eventHub.$emit('DataRefresh_' + this.eventId);
    }
  },
  computed:{},
  created:function(){
 
  },
  mounted: function(){
  }
 });