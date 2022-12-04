const User = require("../UserSchema")
const bcrypt = require("bcrypt");
const { response } = require("express");
require('dotenv').config();
const fetch = require('../node_modules/node-fetch');

const detailsKEY = process.env.detailsKEY;
const geoKey = process.env.geoKey;
const placesKey = process.env.placesKey;

//Send place results
const getPlaceList = async (req, res) => {
    //console.log("Object from angular: ", req.body);

    let user = await User.findById(req.body.id)
    const type = req.body.type;
    const keyword = req.body.keyword;
    const userId = req.body.id;
    const address = req.body.address;
    const radius = req.body.radius;
    let latitude = '';
    let longitude = '';
    let placesObject = undefined;
    let geoObject = undefined;

    if (radius) {
        user.preference.radius = radius;
        user.save();
    }
    
    const longlatPromise = fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+ address + '&key='+ geoKey);
    
    longlatPromise
    .then(response => response.json())
    .then(response => {
        geoObject = response;
        latitude = geoObject.results[0].geometry.location.lat;
        longitude = geoObject.results[0].geometry.location.lng;
        console.log("Lat Long promise result: ", geoObject.results[0].geometry.location.lat + '/' + geoObject.results[0].geometry.location.lng);
}, rejected => {console.log("Rejected: ", rejected)})
    .then(() => {
        const placePromise = fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword='+ keyword +'&location='+ latitude +'%2C'+ longitude +'&radius='+ radius +'&type='+ type +'&key='+ placesKey);
        placePromise
        .then(response => response.json())
        .then(async response => {

            placesObject = response;

            let sortedPlaces = await sortQueryResultByPreference(placesObject.results, userId)
            placesObject.results = sortedPlaces
            let geoPlace = {
                geo: geoObject,
                places: placesObject
            }
            res.json(geoPlace);
            
        })
    })

}

//Send places using places advanced method
const getPlacesAdvanced = async (req, res) => {

    const type = req.body.type;
    const keyword = req.body.keyword;
    const userId = req.body.userId;
    const address = req.body.address;
    const radius = req.body.radius;
    let latitude = '';
    let longitude = '';
    let placesObject = undefined;
    let geoObject = undefined;

    
    const longlatPromise = fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+ address + '&key='+ geoKey);
    
    longlatPromise
    .then(response => response.json())
    .then(response => {
        geoObject = response;
        latitude = geoObject.results[0].geometry.location.lat;
        longitude = geoObject.results[0].geometry.location.lng;
        console.log("Lat Long promise result: ", geoObject.results[0].geometry.location.lat + '/' + geoObject.results[0].geometry.location.lng);
}, rejected => {console.log("Rejected: ", rejected)})
    .then(() => {
        const placePromise = fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword='+ keyword +'&location='+ latitude +'%2C'+ longitude +'&radius='+ radius +'&type='+ type +'&key='+ placesKey);
        placePromise
        .then(response => response.json())
        .then(async response => {

            placesObject = response;

            let geoPlace = {
                geo: geoObject,
                places: placesObject
            }
            res.json(geoPlace);
            
        })
    })

}

// Get all users
const getAllUsers = async (req, res) => {
    const users = await User.find()
    res.json(users)
}

// Create a user
const createNewUser = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const user = await User.create({
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, salt),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email:req.body.email,
            age: req.body.age,
            sex: req.body.sex,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            createdAt: Date.now()
        })

        res.status(201).json(user)
        console.log(user)
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'The username is already registered' })
        }
        return res.status(500).json({ message: err.message })
    }
}

 const editUser = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        let user = await User.findById(req.body.id)
        if (!user) {
            return res.status(204).json({ message: `No user matches ID ${req.body.id}.` })
        }else{
            const filter = { _id: req.body.id };
            let pass = String(req.body.password);
            console.log("Filter:",filter);
            const options = { upsert: false };
            let updateDoc = {
                $set: {
                 // username: req.body.username,
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  age: req.body.age,
                  sex: req.body.sex,
                  city: req.body.city,
                  state: req.body.state,
                  country: req.body.country
                },
              };
            if(pass.length != 0){
                
                 updateDoc = {
                    $set: {
                     // username: req.body.username,
                      password: await bcrypt.hash(req.body.password, salt),
                      firstName: req.body.firstName,
                      lastName: req.body.lastName,
                      age: req.body.age,
                      sex: req.body.sex,
                      city: req.body.city,
                      state: req.body.state,
                      country: req.body.country
                    },
                };
            } 
            
            
            const result = await User.updateOne(filter, updateDoc, options);
            user = await User.findById(req.body.id)
            console.log("Result of update:",result);
            console.log("user updated", user);

        }
    
       

            

        res.status(201).json(user)
        console.log(user)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
} 
      
const getPlace = async (req, res) => {
    const placeId = req.params.placeId;
    let placesObject = undefined;
    console.log("getplace Id: ",placeId);

     try {
    const idPromise = fetch('https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Cadr_address%2Cvicinity%2cphoto%2Cformatted_phone_number%2cicon%2Curl%2Crating%2Creviews%2Cprice_level%2Ceditorial_summary%2Copening_hours&place_id='+ placeId + '&key='+detailsKEY);
    
   idPromise
        .then(response => response.json())
        .then(async response => {

            placesObject = response;
            console.log(placesObject);

            res.json(placesObject);
            
        },rejected => {console.log("Rejected: ", rejected)});
            } catch (err) {
        return res.status(500).json({ message: err.message })
    } 
}


// Get a user by id
const getUserById = async (req, res) => {
    try {
        let uID = req.params.id;
        console.log("Getting user: ",uID);
        const user = await User.findById(uID)
        if (!user) {
            return res.status(204).json({ message: `No user matches ID ${uID}.` })
        }
        res.json(user)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// Store quiz result to DB
const gradeQuiz = async (req, res) => {

    // console.log("test", req.body); 
    let user = await User.findById(req.body.id)
    user.preference.quizResult.clear()
    const gradeTable = {
        // For each scale (extroverted, outdoor, active, sensitive), we have two variables, sum and count in the DB.
        // E.g., extrovertedSum, extrovertedCount. When we need to know the percentage (how extroverted the user is)
        // We just need to divide sum by count.
        // By keeping track of the count, we can keep each value's impact the same.
        // (otherwise the later added value will have higher impact)

        // -1 means this answer doesn't affect this scale. Thus, it won't be added to sum and count.
        a1:  [7, -1, 7, -1],
        b1:  [4, -1, 0, -1],
        c1:  [6, -1, 5, -1],
        d1:  [8, -1, 7, -1],

        a2:  [10, -1, 7, -1], // Restaurant 10
        b2:  [6, -1, 5, -1], // Restaurant 8
        c2:  [4, -1, 5, -1],
        d2:  [0, -1, -1, -1],

        a3:  [9, -1, 7, -1],
        b3:  [6, -1, -1, -1],
        c3:  [5, -1, 0, -1],
        d3:  [3, -1, -1, -1],

        a4:  [-1, -1, -1, 8], // Museum 10
        b4:  [-1, -1, -1, -1], // Museum 8
        c4:  [-1, -1, -1, -1], // Museum 5
        d4:  [-1, -1, -1, -1], // Museum 0

        a5:  [-1, 10, -1, -1], // Park 10 Trail 10
        b5:  [-1, 8, -1, -1], // Park 8 Trail 8
        c5:  [-1, 5, -1, -1],
        d5:  [-1, 0, -1, -1], // Park 0 Trail 0

        a6:  [-1, -1, 9, -1],
        b6:  [-1, -1, 6, -1],
        c6:  [-1, -1, 4, -1],
        d6:  [-1, -1, 5, -1], // Trail 8

        a7:  [8, -1, 10, -1],
        b7:  [6, -1, 7, -1],
        c7:  [3, -1, 5, -1],
        d7:  [2, -1, 1, -1],

        a8:  [7, -1, 4, -1],
        b8:  [7, -1, 10, -1], // Bar 10
        c8:  [7, -1, -1, -1], // Bar 7
        d8:  [-1, -1, -1, -1], // Bar 0

        a9:  [10, -1, -1, 5], // E 10
        b9:  [8, -1, -1, -1], 
        c9:  [5, -1, -1, 6], 
        d9:  [-1, -1, -1, 8], 

        a10: [6, -1, 10, -1],
        b10: [-1, 10, 8, -1], // Trail 10  extroverted, outdoor, active, sensitive
        c10: [-1, -1, 6, -1],
        d10: [-1, -1, 0, -1], // Movie Theater 7
        
        a11: [6, -1, 10, -1],
        b11: [-1, 10, 8, -1], 
        c11: [-1, -1, 6, -1],
        d11: [-1, -1, 0, -1], 

        a12: [6, -1, 10, -1],
        b12: [-1, 10, 8, -1], 
        c12: [-1, -1, 6, -1],
        d12: [-1, -1, 0, -1],
        
        a13: [6, -1, 10, -1],
        b13: [-1, 10, 8, -1], 
        c13: [-1, -1, 6, -1],
        d13: [-1, -1, 0, -1],

        a14: [6, -1, 10, -1],
        b14: [-1, 10, 8, -1], 
        c14: [-1, -1, 6, -1],
        d14: [-1, -1, 0, -1],
    }
    const ansArray = req.body.results;

    let extroverted = 0
    let outdoor = 0
    let active = 0
    let sensitive = 0
    let extrovertedCount = 0
    let outdoorCount = 0
    let activeCount = 0
    let sensitiveCount = 0

    ansArray.forEach(function(item) {
        // choice: [extroverted, outdoor, active, sensitive]
        grade = gradeTable[item]
        if (grade[0] != -1) {
            extroverted += grade[0]
            extrovertedCount += 1
        }
        if (grade[1] != -1) {
            outdoor += grade[1]
            outdoorCount += 1
        }
        if (grade[2] != -1) {
            active += grade[2]
            activeCount += 1
        }
        if (grade[3] != -1) {
            sensitive += grade[3]
            sensitiveCount += 1
        }
    })

    // Prevent zero division error
    user.preference.extroverted = extrovertedCount > 0 ? extroverted / extrovertedCount : 0
    user.preference.outdoor = outdoorCount > 0 ? outdoor / outdoorCount : 0
    user.preference.active = activeCount > 0 ? active / activeCount : 0
    user.preference.sensitive = sensitiveCount > 0 ? sensitive / sensitiveCount : 0
    user = assignPlaceTypeValueBasedOnUserCharacteristics(user)
    user.hasTakenQuiz = true
    user.preference.radius = req.body.radius;
    user.save();
    res.json(user)
}

function helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, addHalf, user) {
    if (addOne) {
        for (let i = 0; i < addOne.length; i++) {
            console.log(addOne[i], user.preference.quizResult.get(addOne[i]))
            if (user.preference.quizResult.get(addOne[i])) {
                original = user.preference.quizResult.get(addOne[i])
                user.preference.quizResult.set(addOne[i], original + 1)
            } else {
                user.preference.quizResult.set(addOne[i], 1)
            }
        }
    }
    if (addHalf) {
        for (let i = 0; i < addHalf.length; i++) {
            if (user.preference.quizResult.get(addHalf[i])) {
                original = user.preference.quizResult.get(addHalf[i])
                user.preference.quizResult.set(addHalf[i], original + 0.5)
            } else {
                user.preference.quizResult.set(addHalf[i], 0.5)
            }
        }
    }
    return user
}

function assignPlaceTypeValueBasedOnUserCharacteristics(user) {
    let extroverted = user.preference.extroverted
    let outdoor = user.preference.outdoor
    let active = user.preference.active
    let sensitive = user.preference.sensitive

    // extroverted
    if (extroverted > 7.5) {
        let addOne = [ "bar", "night_club", "amusement_park", "movie_theater","restaurant"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, null, user)

    } else if (extroverted > 5) {
        let addOne = ["bowling_alley", "movie_theater", "amusement_park","cafe","restaurant"]
        let addHalf = ["bar", "night_club"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, addHalf, user)
    } else if (extroverted > 2.5) {
        let addOne = ["meal_takeaway","meal_delivery"]
        let addHalf = ["cafe", "museum"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, addHalf, user)
    } else {
        let addOne = ["meal_delivery","park"]
        let addHalf = ["cafe", "library"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, addHalf, user)
    }
    
    // outdoor
    if (outdoor > 7.5) {
        let addOne = [ "campground", "park", "amusement_park","trail"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, null, user)
    } else if (outdoor > 5) {
        let addOne = ["park","trail"]
       // let addHalf = []
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, addHalf, user)
    } else if (outdoor > 2.5) {
        let addOne = ["museum", "movie_rental", "restaurant","museum"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, null, user)
    } else {
        let addOne = ["book_store", "meal_delivery", "movie_rental"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, null, user)
    }
    
    // active
    if (active > 7.5){
        let addOne = ["trail", "gym","park","bowling_alley"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, null, user)
    } else if (active > 5) {
        let addOne = ["bowling_alley", "restaurant",  "park", "movie_theater"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, null, user)
    } else if (active > 2.5) {
        let addOne = ["meal_takeaway","movie_theater"]
        let addHalf = ["department_store", "convenience_store"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, addHalf, user)
    } else {
        let addOne = ["meal_delivery", "movie_rental"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, null, user)
    }

    // sensitive
    if (sensitive > 7.5) {
        let addOne = [ "museum","art_gallery", "bakery", "zoo", ]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, null, user)
    } else if (sensitive > 5) {
        let addOne = ["park", "bakery", "aquarium", "zoo","restraurant"]
        let addHalf = ["museum", "pet_store"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, addHalf, user)
    } else if (sensitive > 2.5) {
        let addHalf = ["cafe", "bar"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(null, addHalf, user)

    } else {
        let addOne = [ "bar","bowling_alley"]
        user = helperForAssigningPlaceTypeBasedOnCharacteristics(addOne, null, user)
    }
    console.log(user)
    return user
}

const getPercentage = async (req, res) => {
    try {
        let user = await User.findById('6369d6c04184bd98f8f9270e')//req.body.id)
        // If statements to prevent zero division error. Somehow it's not throwing zero division error, but I send 5 as default if count == 0.
        switch (req.params.scale) {
            case "extroverted":
                if (user.preference.extrovertedCount == 0) {
                    return res.json({ "sensitive": 5 })
                }
                return res.json({ "extroverted": Math.round(user.preference.extrovertedSum / user.preference.extrovertedCount) })
    
            case "outdoor":
                if (user.preference.outdoorCount == 0) {
                    return res.json({ "sensitive": 5 })
                }
                return res.json({ "outdoor": Math.round(user.preference.outdoorSum / user.preference.outdoorCount) })
    
            case "active":
                if (user.preference.activeCount == 0) {
                    return res.json({ "sensitive": 5 })
                }
                return res.json({ "active": Math.round(user.preference.activeSum / user.preference.activeCount) })
    
            case "sensitive":
                if (user.preference.sensitiveCount == 0) {
                    return res.json({ "sensitive": 5 })
                }
                return res.json({ "sensitive": Math.round(user.preference.sensitiveSum / user.preference.sensitiveCount) })
                
            default:
                return res.json({ message: `Scale ${req.params.scale} not found.` })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

async function sortQueryResultByPreference(places, userId) {
    let user = await User.findById(userId)

    let sortedPlaces = altCalculateMatchScoreAndSortByMatchScore(user, places)
    //let sortedPlaces = calculateMatchScoreAndSortByMatchScore(user, places)
    //console.log(sortedPlaces)
    return sortedPlaces
}


// """""Helper function to calculate and sort the places"""""
// Takes in the user placeType preference table and list of place.
// Returns a list of [matchScore, placeName]
function calculateMatchScoreAndSortByMatchScore(user, places) {
    let res = []
    let userPlaceTypeTable = user.preference.placeType
    // """""This big nested for-loop give each place a match score."""""
    // The outer loop is to loop thru the places from query result
    for (let i = 0; i < places.length; i++) {
        // one place from the places
        let place = places[i]
        // the match score for this place
        let value = 0

        // the count is only incremented if the user has that type
        let count = 0

        // This inner loop is to loop thru each type this place have
        for (let j = 0; j < place.types.length; j++) {
            type = place.types[j]
            let placeTypeValue = userPlaceTypeTable.get(type)
            let quizResultValue = user.preference.quizResult.get(type)
            if (placeTypeValue != null) {
                console.log(placeTypeValue)
                count ++
                value += placeTypeValue[0] / placeTypeValue[1]
                if (quizResultValue) {
                    value += quizResultValue
                }
            }
        }
        value += place.rating * 2
        count += 1
        place["matchScore"] = Math.round((value / count * 100)) / 100
        if (place["matchScore"]) {
            res.push(place) // Round to 2 decimal places
        }
    }

    // This sorts the res array by score.
    res.sort(function(a, b) {
        let x = a.matchScore
        let y = b.matchScore

        if (x < y) {
            return 1
        }
        if (x > y) {
            return -1
        }
        return 0
    })

    return res
}

//Alternative match score method to not include businesses that
//do not have user types in the place list
function altCalculateMatchScoreAndSortByMatchScore(user, places) {
    //console.log("Places coming in: ", places);
    let res = []
    let userPlaceTypeTable = user.preference.placeType
    // """""This big nested for-loop give each place a match score."""""
    // The outer loop is to loop thru the places from query result
    for (let i = 0; i < places.length; i++) {
        // one place from the places
        let place = places[i]
        // the match score for this place
        let value = 0

        // the count is only incremented if the user has that type
        let count = 0
        // boolean to know whether type has been found
        let foundType = false //Added from original

        // This inner loop is to loop thru each type this place have
        for (let j = 0; j < place.types.length; j++) {
            let type = place.types[j]
            let placeTypeValue = userPlaceTypeTable.get(type)
            let quizResultValue = user.preference.quizResult.get(type)
            if (user.preference.quizResult.has(type)) {
                foundType = true //Added from original
                //console.log("Type/value/place: " + type + "/" + quizResultValue + "/" + place.name)
                ++count
                value += quizResultValue
            }
        }
    
        if(place.rating && foundType) {
           value += place.rating * 2
           count += 1
        }

        if (value == 0 || count == 0) {
            count = 1;
        }
        place["matchScore"] = Math.round((value / count * 100)) / 100
        if (place["matchScore"] > 0) {
            res.push(place)
        }
        
        
    }

    

    // This sorts the res array by score.
    res.sort(function(a, b) {
        let x = a.matchScore
        let y = b.matchScore

        if (x < y) {
            return 1
        }
        if (x > y) {
            return -1
        }
        return 0
    })

    //console.log("Alt sort method: ", res);

    return res
}
const addPlaceToFavorite = async(req, res) => {
    let user = await User.findById(req.body.id)
    let place = req.body.place

    console.log("is it true", user.preference.favoritePlaces.has("0") )

    if  (user.preference.favoritePlaces.has("0")) {
        let favarray = user.preference.favoritePlaces.get("0")
        favarray.push(place)
        console.log("test", favarray)
        user.preference.favoritePlaces.set("0", favarray)

    }else{

    user.preference.favoritePlaces.set("0", [])

    }

    user.save();


    // let placeArray = ["places"]
    //console.log("is it working", place)
    res.json(user);
       
}
const getFavoritePlace = async (req, res) => {
    const user = await User.find(req.body.id)
    const place = req.body.place
    res.json(favarray)
}

// remove a place from favorite
const removePlaceFromFavorite = async(req, res) => {
    let user = await User.findById(req.body.id)
    let place = req.body.place
    
    if  (user.preference.favoritePlaces.has("0")) {
        let favarray = user.preference.favoritePlaces.get("0")
        favarray.splice(place,1)
        console.log("test", favarray)
        user.preference.favoritePlaces.set("0", favarray)

    }else{

    user.preference.favoritePlaces.set("0", [])

    }

   

    user.save();
    res.json(user);
}





module.exports = {
    getAllUsers,
    createNewUser,
    getUserById,
    gradeQuiz,
    getPercentage,
    sortQueryResultByPreference,
    editUser,
    getPlaceList,
    getPlacesAdvanced,
    getPlace,
    addPlaceToFavorite,
    getFavoritePlace,
    removePlaceFromFavorite,
   
    
}