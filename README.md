#Mongoose 练习<br />
练习任务：通过mongoose 完成对mongoDB数据的CRUD操作<br>
下图是创建的数据


![](https://github.com/shenhua0222/mongoose-8/blob/master/public/images/1.jpg)
###问题一
创建数据后再进行编辑操作时，显示的全是undefined



![](https://github.com/shenhua0222/mongoose-8/blob/master/public/images/2.jpg)
###问题二 点击删除，数据没有删除，返回的是404页面，如下图所示
![](https://github.com/shenhua0222/mongoose-8/blob/master/public/images/3.jpg)

删除数据代码
```javascript
app.delete('/tasks/:id',function(req,res){
	Task.findById(req.params.id, function(err,doc){
		if(!doc) return next(new NotFound('Document not found'));
		doc.remove(function() {
			res.redirect('/tasks');
		});
	});
});
```

###前端菜鸟，希望有大神指点  

***
##2017.02.16更新  
###解决问题  
-  创建数据不显示
-  点击编辑数据显示undefined
- 更新数据，提交返回404
- 点击删除返回404    
###学习经验
- model创建一个实例之后必须保存，否则在数据库中检索不到  
- req.body 具体是什么如果不知道需要在console.log进行查询
- 在jade模板中引用数据:#{};

