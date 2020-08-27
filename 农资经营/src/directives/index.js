/**
 * 自定义指令
 */

import timeFormat from './date'
export default function(Vue){
	Vue.directive('auto-focus', {
	  inserted: function (el,bind) {
	    if(bind.value){
	      el.focus()
	    }
	  },
	  update (el,bind){
	    if(bind.value != bind.oldValue){
	    	el.focus()
	    }
	  }
	});

	Vue.directive('auto-select', {
	  inserted: function (el,bind) {
	    if(bind.value){
	      el.select()
	    }
	  },
	  update (el,bind){
	    if(bind.value){
	      el.select()
	    }
	  }
	});
	
	Vue.directive('permission',{ //权限按钮指令
		bind(el,binding){
	    let permissionList = router.currentRoute.meta.permission;
			if(!(permissionList && Vue.prototype.$ImeAuthUtils.hasPermssion(binding.value,permissionList))){
				el.parentNode.removeChild(el);
			}
		}
	});
	Vue.directive('timeformat', {  //仅仅在展示数据时可以，不会改变data原有值
		inserted(el, bind) {
			const dom = el.querySelector('input') || el; 
			Vue.nextTick(()=>{  
				dom.value = timeFormat.one(dom.value)
			})
		},
		update(el, bind){
			const dom = el.querySelector('input') || el; 
			Vue.nextTick(()=>{ //保证在本轮时间结束后修改值，因为此时的data中保存的值事没有被修改的还是原来的值所以需要在本轮事件结束后执行
				dom.value = timeFormat.one(dom.value)
			})
		}
	});
	Vue.directive('upperCase', { 
		update(el, binding) {
			Vue.nextTick(()=>{
				const dom = el.querySelector('input') || el; 
				if(dom.nodeName === 'INPUT'){
					const event = new Event('input');
					dom.value = dom.value.toUpperCase(); 
					dom.dispatchEvent(event);
				}else{
					console.error("v-upperCase指令没有被正确使用,绑定的dom没有找到input子节点亦或绑定指令的dom本身不是input节点。")
				}
			})
		}
	});
}

