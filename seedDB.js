const mongoose = require("mongoose");
const User = require('./models/User');
const Cottage = require('./models/Cottage');
const Reservation = require('./models/Reservation');

const data = {
    users: [
        {"_id":"5c6074870379e61bd4c8541d","reservations":[],"username":"admin","admin":true,"firstname":"Olli","lastname":"Omistaja","address":"reserved","postalCode":12345,"phone":123456789,"email":"admin@cottetsi.fi","salt":"1ceccdf9a83b44fac9ce96e3667581842670110d6741fca32d5d363932f4071c","hash":"4d72d0ed6171a6c5bc2b395b0084c1e91eeb16116b2a2d2f986af050b99966f5c98b42278e2ae830434dc007d9169c47484a30747700d256ddbed33e3b5faa5125ecbefa73aa21138132eb1fa7a730bae9d1e3b7630b125dcf47f40f55e4f6fd8c63587e015e0e43ae89de42ef6e52f3f4658e4cc28e6b31956c7140ad0247483b7dfc8608a7c8ab787b5bc4244d6fe2756c95aff0cbf6957f4e5db3ef4d3e165a6e87bda7aeb840a0fba3859680099146fa5079de6abc7e6713e97fd37eea08b4b89f759c77ba575739fc76dc9d2d140fdc55498b7cc021586404a5fe80a728ac6b64aed450b53e299c89cb73725b471718b00fbe2d1aff6d01240ceb1e3b5db44d631d96df8b8740d4929bdcc50f078ce8bb93bda8e465dee7339ff37d17df52b98e93b55a909dc0598e85633e9ef52c8866d2e66e9bc2e88f0a18d2a671c963283c9602cb149e4201fe6408268af1ff17053220346acc98c876c2b6240045720a8fc1d2290bdbf2d9382d0af0e37e4a859451dd7c6d30eb3120daf502bb109ac2a0a62cfceab60a3486098336294dfb961f9ce928db9c5c0263e2688aa5ea4ba71eb905164622b0c4ce74ffa31ade9672c226d17c931108ac2e2d92dc36841abea515e40fc0b12c728d78047875eb805b5a6b84a0382e444df3c7e7ce981f7c50c8ab37f0a5057fea85afeeee204a3c147e710a1a510a75aa9b55fa7ffa5d"},
        {"_id":"5c6075499136bc15e807d3d8","reservations":[],"username":"user","admin":false,"firstname":"Anssi","lastname":"Asiakas","address":"reserved","postalCode":12345,"phone":123456789,"email":"asiakas@cottetsi.fi","salt":"d4c25c5f1a938deeb621748b4b9f2cdae112fa276a392eaf25081a6bea7cd9f1","hash":"5c9c0c9b138726a29cdadc534be3e6e9a77545cfbc5152c3aecb87efb1c1782698f96de67b66da9e5be1ff830fb696b457854a1927238ab673c2aa08498678a1745810eb13033244c6cfca524496e87e0e048a4b331caae0c73fdac4ab2ec87e0a3c6bec90846dd56957a20b3bd72db60d780f23fefc10e79e48a1782da515c56038f31b257974599ddad4543476d50e5a01786077a58b635550613defa249e80fa33d0511d59ab1f61331d4c2ef56ffbed45d19aa66821cf53c497faaa436272e4c1be9d1e5f87ed092e47ec4a68f04ed88660d8d6e098f794b2b4a6e6c45edb764717ce433d5f054d6033f9cd9d22598952387e569fa6335001a39b4c63b9b00a708afe63f9dd8aa37577fb3bfcc662726c1381e376940c7ec3198350ea8c5b3f91ce4588616b3393aebdcbc4be8abc8aa3d7b0efb1ee8201d426ca9d2f2fed355b91c7c33bf8fef5d57c89472ad717d6a8d38c78b5db1632c4a98a2d1700522f55abdc6d833df47f31974f00741ce5a0bb4860f8e446947d56191ed011034f2cde402435f794e0387d02754df0c741cfd6686ab0009f47b2017d0fce19df7def4d91dd57412f134f1b9c01d1be113ef27aea716cc343c0d23a858b840c09cdc3be0710d339ec84a5e4ae0b45356bfa46665954d42a61fdfa5ee559906a68a53cd16a6fd6429d4e0fd7bbb04592affbca3599ade998f5a5978418ef4e3be16"}],
    cottages: [
        {name:"First Cottage",location: "At First Location",price:100,image:"5817409647_50a0f1bf51_b.jpg",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean iaculis risus vel nibh elementum aliquet. Donec tristique mi ex, id accumsan felis luctus vel. Ut scelerisque ipsum eu sem placerat aliquam vel a sapien. Quisque neque nunc, vehicula vitae molestie non, commodo sit amet urna. Duis non sollicitudin urna. Nulla eget quam mi."},
        {name:"Second Cottage",location:"At Second Location",price:200,image:"5817418723_2bda59f000_b.jpg",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean iaculis risus vel nibh elementum aliquet. Donec tristique mi ex, id accumsan felis luctus vel. Ut scelerisque ipsum eu sem placerat aliquam vel a sapien. Quisque neque nunc, vehicula vitae molestie non, commodo sit amet urna. Duis non sollicitudin urna. Nulla eget quam mi."},
        {name:"Third Cottage",location:"At Third Location",price:300,image:"5817984136_a85f4ab07b_b.jpg",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean iaculis risus vel nibh elementum aliquet. Donec tristique mi ex, id accumsan felis luctus vel. Ut scelerisque ipsum eu sem placerat aliquam vel a sapien. Quisque neque nunc, vehicula vitae molestie non, commodo sit amet urna. Duis non sollicitudin urna. Nulla eget quam mi."}],
    reservations: []
};

module.exports = function(resetDb) {
    if(!resetDb) return;
    User.remove({}, function (err) {
        if (err) console.error(err);
        data.users.forEach(user => {
            User.create(user, function (err, success) {
                if (err) console.error(err);
            });
        });
    });
    Cottage.remove({}, function (err) {
        data.cottages.forEach(cottage => {
            if (err) console.error(err);
            Cottage.create(cottage, function (err, success) {
                if (err) console.error(err);
            });
        });
    });

    Reservation.remove({}, function (err) {
        if (err) console.error(err);
        if (data.reservations.length > 0) {
            data.reservations.forEach(reservation => {
                Reservation.create(reservation, function (err, success) {
                    if (err) console.error(err);
                });
            });
        }
    });
};

