const User = require("../UserSchema")
const bcrypt = require("bcrypt")
require('dotenv').config();

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
        return res.status(400).json({ message: err.message })
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
                  username: req.body.username,
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
                console.log("if clause executes");
                 updateDoc = {
                    $set: {
                      username: req.body.username,
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
    console.log("test", req.body); 
    let user = await User.findById(req.body.id)
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

        a9:  [10, -1, -1, -1], // Coffee shop 10
        b9:  [8, -1, -1, -1], // Coffee shop 8
        c9:  [-1, -1, -1, -1], // Coffee shop 5
        d9:  [-1, -1, -1, -1], // Coffee shop 0

        a10: [6, -1, 10, -1],
        b10: [-1, 10, 8, -1], // Trail 10
        c10: [-1, -1, 6, -1],
        d10: [-1, -1, 0, -1], // Movie Theater 7
        
        a11: [6, -1, 10, -1],
        b11: [-1, 10, 8, -1], // Trail 10
        c11: [-1, -1, 6, -1],
        d11: [-1, -1, 0, -1], // Movie Theater 7

        a12: [6, -1, 10, -1],
        b12: [-1, 10, 8, -1], // Trail 10
        c12: [-1, -1, 6, -1],
        d12: [-1, -1, 0, -1], // Movie Theater 7
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

    assignPlaceTypeValueBasedOnUserCharacteristics(user)
    user.save();
    res.json(user)
}

function assignPlaceTypeValueBasedOnUserCharacteristics(user) {
    if (user.preference.extroverted > 7.5) {
        // another for loop to modify user place type preference
    } else if (user.preference.extroverted > 5){
        // another for loop to modify user place type preference
    } else if (user.preference.extroverted > 2.5){
        // another for loop to modify user place type preference
    } else {
        // another for loop to modify user place type preference
    }

    // same for outdoor, active, and sensitive
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

const sortQueryResultByPreference = async (req, res) => {
    let user = await User.findById(req.body.userId)
    let places = req.body.results
    let userPlaceTypeTable = user.preference.placeType

    let sortedPlaces = calculateMatchScoreAndSortByMatchScore(userPlaceTypeTable, places)

    console.log(sortedPlaces)
    res.json(sortedPlaces)
}


// """""Helper function to calculate and sort the places"""""
// Takes in the user placeType preference table and list of place.
// Returns a list of [matchScore, placeName]
function calculateMatchScoreAndSortByMatchScore(userPlaceTypeTable, places) {
    let res = []

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
            if (placeTypeValue != null) {
                count ++
                value += placeTypeValue[0] / placeTypeValue[1]
            }
        }

        value += place.rating * 2
        count += 1
        res.push([Math.round((value / count * 100)) / 100, place.name]) // Round to 2 decimal places
    }

    // This sorts the res array by score.
    res.sort(function(a, b) {
        let x = a[0]
        let y = b[0]

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

module.exports = {
    getAllUsers,
    createNewUser,
    getUserById,
    gradeQuiz,
    getPercentage,
    sortQueryResultByPreference,
    editUser
}