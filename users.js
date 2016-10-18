 function User(name, password){
 	if (typeof name == 'undefined') {
 		throw 'User requires a name';
 	}
 	this.name = name;

 	if (typeof password != 'undefined') {
 		// look up regex later 
 		// using string for now
 		this.password = password.replace(/[^0-9A-Za-z]/, '');
 	}else{
 		throw 'User requires a password'
 	};

 };


 module.exports = User;