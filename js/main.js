;(function(){

	var Event = new Vue();
	var alert_sound=document.getElementById('alert-sound');

	function copy(obj){
		return Object.assign({},obj);
	}

	Vue.component('task',{
		template:'#task-tpl',
		props:['todo'],
		methods:{
			action:function(name,params){
				Event.$emit(name,params)	//调用新事件
			}
		}
	})


	 new Vue({
	 	el:'#main',
	 	data:{
	 		useList:[],
	 		last_id:0,
	 		current:{
	 			title:'',
	 			completed:false,
	 			desc:'',}
	 	},
	 	mounted:function(){
	 		var me = this;
	 		this.useList = ms.get('useList')||this.useList;
	 		this.last_id = ms.get('last_id')||this.last_id;
	 		setInterval(function(){
	 			me.check_alerts();
	 		},1000);
	 		Event.$on('remove',function(id){
				if(id){
					me.remove(id);
				}

	 		});		//允许子组件触发的方法,监听
	 		Event.$on('toggle_complete',function(id){
				if(id){
					me.toggle_complete(id);
				}

	 		});
	 		Event.$on('set_current',function(id){
				if(id){
					me.set_current(id);
				}

	 		});
	 		Event.$on('toggle_detail',function(id){
				if(id){
					me.toggle_detail(id);
				}

	 		});
	 	 	},


	 	methods:{
	 		check_alerts:function(){
	 			var me = this;
	 			this.useList.forEach(function(row,i){
	 				var alert_at = row.alert_at;
	 				if(!alert_at||row.alert_confirmed) return;
	 				var alert_at = (new Date(alert_at)).getTime();//1970至今 毫秒
	 				var now = (new Date()).getTime();
	 				if(now>=alert_at){
	 					alert_sound.play();
	 					var confirmed = confirm(row.title);	
	 					Vue.set(me.useList[i],'alert_confirmed',confirmed);


	 				}
	 				
	 			})
	 		},

	 		merge:function(){
	 			var is_update, id ;
	 			is_update = id = this.current.id;
	 			if(is_update){
	 				var index = this.find_index(id);
	 				Vue.set(this.useList, index, copy(this.current));
	 			}else{
		 			var title=this.current.title;
		 			if(!title && title !== 0)return;

		 			var todo = copy(this.current);
		 			this.last_id++;
		 			ms.set('last_id',this.last_id);
		 			todo.id = this.last_id;
		 			this.useList.push(todo);
		 				
	 			}
	 			this.reset_current();
	 			
	 		},
	 		remove:function(id){
	 			var index = this.find_index(id);
	 			this.useList.splice(index,1);
	 		},
	 		next_id:function(){
	 			return this.useList.length + 1;
	 		},

	 		set_current:function(todo){
	 			this.current = copy(todo);
	 		},
	 		reset_current:function () {
	 			this.set_current({})
	 		},
	 		find_index:function(id){
	 			return this.useList.findIndex(function(item){
	 				return item.id == id;
	 			})
	 		},
	 		toggle_detail:function(id){
	 			var index=this.find_index(id);
	 			Vue.set(this.useList[index],'show_detail',!this.useList[index].show_detail);
	 		},
	 		toggle_complete:function(id){
	 			var i = this.find_index(id);
	 			Vue.set(this.useList[i], 'completed', !this.useList[i].completed);
	 		},

	 	},
	 	watch:{
	 		useList:{
	 			deep:true,
	 			handler:function(o,n){
	 				if(n){
	 					ms.set('useList',n);
	 				}else{
	 					ms.set('useList',[]);
	 				}
	 			}
	 		}
	 	}
	 })
})();