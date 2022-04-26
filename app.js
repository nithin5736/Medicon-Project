const { application } = require('express');
const express = require('express');
const res = require('express/lib/response');
const mongoose = require('mongoose');

// express app
const app = express();

// connect to MONGODB
const dbURI = 'mongodb+srv://customer:9849gubba@customer.gqkcm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => app.listen(3000)) // listen for requests
	.catch((err) => console.log(err))

// register view engine
app.set('view engine', 'ejs')
const customer = require('./models/customer')
const product = require('./models/product')
const { json } = require('express')


// middle ware &static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// product.find()
// 	.then((result) => {
// 		console.log(result);
// 	})


// Signup
let cust = null;
app.post('/login', async (req, res) => {
	try {
		const password = req.body.psw;
		const cpassword = req.body.conpsw;
		if (password === cpassword) {
			cust = new customer({
				fullname: req.body.fullname,
				email: req.body.mail,
				password: req.body.psw,
				confirmpassword: req.body.conpsw
			})
			res.send("<h1>passwords matched<h1>");
			const registered = await cust.save();
			//    res.status(201).render('login');
		} else {
			res.send("<h1>passwords not matched<h1>");
		}
	}
	catch (error) {
		res.status(400).send(error);
	}
});


// Login
app.post('/index', async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		customer.find()
			.then((result) => {
				result.forEach(tempCust => {
					//console.log(result);
					if(tempCust.email == email){
						if (tempCust.password === password) {
							cust = tempCust;
							res.status(201).render("index1");
						}
						else {
							res.send("<h1>password not exists</h1>");
						}
					}
				});
			})
	}
	catch (error) {
		res.status(400).send("<h1>invalid email</h1>")
	}
})

// admin Login
app.post('/admin', async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		const useremail = await admin.findOne({email:email});
		console.log('hi');
		console.log(useremail);
		if(useremail.password === password){
			res.status(201).render("admin");
		}else{
			res.send("Passwords not matched");
		}
	}
	catch (error) {
		res.status(400).send("<h1>invalid email</h1>")
	}
})

// medicines
app.get('/medicines', (req, res) => {
	let flag = 0;
	product.find()
		.then((result) => {
			//console.log(result);
			//console.log(req.body.username, req.body.password)
			res.render("medicines", { result })
		})
		.catch((err) => {
			res.render("failure-query", { data: "Failed to log-in, please try again!" , cust : cust})
			console.log(err)
		})
})

// Add to cart
app.get("/medicines/:id", (req, res) => {
	if (cust == null) {
		res.render("login");
	} else {
		const id = req.params.id;
		product.findById(id)
			.then(() => {
				let count = 0;
				let tempSet = new Set(cust.cart);
				(cust.cart).forEach(product => {
					// console.log(product);
					if (product._id == id) {
						count++;
					}
				});
				console.log(count);
				if (count == 0) {
					tempSet.add(id);
					cust.cart = Array.from(tempSet);
					console.log(cust.cart);
					customer.findOneAndUpdate({ email: cust.email }, {
						cart: cust.cart
					}, (err) => {
						console.log(err);
					})
					console.log("Product has been added into cart");
					//console.log(cust);
					res.redirect("/medicines");
				}
			})
	}
})

// show cart
app.get("/cart", (req, res) => {
	if (cust == null) {
		res.render("login");
	} else {
			let products = [];
			  product.find()
				.then((result) => {
					let finalCart = cust.cart;
					//console.log(result);
					for (let j = 0; j < result.length; j++) {
						for (let k = 0; k < finalCart.length; k++) {
							if (result[j]._id == finalCart[k]) {
								products.push(result[j]);
							}
						}

					}
					console.log("\n", cust.fullname, "'s cart contents are: ");
					if (products.length == 0) {
						console.log("---empty---")
					}
					else {
						products.forEach(p => {
							console.log(p.name);
						});
					}
					console.log(products);
					res.render("cart.ejs", { cust, products })
				})
		}
	}
)

app.get("/rem/:id", (req, res) => {
	if (cust == null) {
		res.render("login");
	} else {
		const id = req.params.id;
		let tempArray = (cust.cart);
		console.log(tempArray);
		for (let i = 0; i < tempArray.length; i++) {
			if (tempArray[i] == id) {
				tempArray.splice(i, 1);
			}
		}

		customer.findOneAndUpdate({ email: cust.email }, {
			$pull: {
				cart: id
			}
		}, (err) => {
			console.log(err);
		})

		cust.cart = tempArray;
		console.log(cust.cart);
		console.log(id, "deleted succesfully");
		res.redirect("/cart");
	}
})

app.get('/admin',async(req,res)=>{
	let cust_cnt,pro_cnt;
	await customer.countDocuments({})
	.then((result)=>{
		cust_cnt = result;
	})
	.catch((err) => {
		console.log(err);
	})

	await product.countDocuments({})
	.then(result=>{
		pro_cnt = result;
	})
	.catch((err) => {
		console.log(err);
	})

	res.render('admin',{cust_cnt:cust_cnt,pro_cnt:pro_cnt});
})

app.get('/admincust',(req,res)=>{
	customer.find()
	.then((result)=>{
      res.render('admincust',{cust_data:result})
	})
	.catch((err)=>{
      console.log(err.message);
	})
})

app.get('/adminproduct',(req,res)=>{
	product.find()
	.then((result)=>{
      res.render('adminproduct',{prod_data:result})
	})
	.catch((err)=>{
      console.log(err.message);
	})
})


app.post('/custdelete/:uid',async (req,res)=>{
    const uid=req.params.uid;
    await customer.updateOne({_id:uid},{$set:{blockstatus:'true'}})
    .then((res)=>{
        console.log('Customer Blocked');
    })
    .catch((err)=>{
        console.log(err);
    });
    res.redirect('/admincust');
});

app.post('/custUnblock/:uid',async (req,res)=>{
    const uid=req.params.uid;
    await customer.updateOne({_id:uid},{$set:{blockstatus:'false'}})
    .then((res)=>{
        console.log('Customer unblocked');
    })
    .catch((err)=>{
        console.log(err);
    });
    res.redirect('/admincust');
});

// send html pages
app.get('/', (req, res) => {
	res.render('index');
});

app.get('/index1', (req, res) => {
	res.render('index1');
});

app.get('/medicines', (req, res) => {
	res.render('medicines');
});

app.get('/healthcare_products', (req, res) => {
	res.render('healthcare_products');
});

app.get('/Labtests', (req, res) => {
	res.render('Labtests');
});

app.get('/customer_reviews', (req, res) => {
	res.render('customer_reviews');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/location', (req, res) => {
	res.render('location');
});

app.get('/cart',(req,res)=>{
	res.render('cart');
});

app.get('/bookingform',(req,res)=>{
	res.render('bookingform');
});

app.get('/paymentform',(req,res)=>{
	res.render('paymentform');
});

// 404
app.use((req, res) => {
	res.status(404).render('404');
});