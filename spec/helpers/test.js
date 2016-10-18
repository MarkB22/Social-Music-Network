var User = require('../../users.js');



describe('Test_Users', function () {
  var name;
  var password;

	
	it('should have a username', function () {
    var name="Kevin";
    var user = new User(name, 'kevin1');
    var actual = user.name

     if (true) {console.log(actual)}

    expect(actual).toBe(name);
   
  	
  });

  it('should have a password for the username', function () {
    var password="walid333";
    var user2 = new User('Waleed', password);
    var actual = user2.password;

    if (true) {console.log(actual)};

    expect(actual).toBe(password);
    
  });
  
  it('should throw on no username/password', function () {
     expect(function(){ new User()}).toThrow();
  })
  // it 
});
