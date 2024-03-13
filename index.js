const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const { Contact } = require('./schema.js')

const app = express()
app.use(bodyParser.json())
app.use(cors())

async function connectToDb() {
    try {
        await mongoose.connect('mongodb+srv://Dhivya_23:Dhivya23@cluster0.c6inkef.mongodb.net/ContactManager?retryWrites=true&w=majority&appName=Cluster0')
        console.log('DB connection established ;)')
        const port = process.env.PORT || 8000
        app.listen(port, function() {
            console.log(`Listening on port ${port}...`)
        })
    } catch(error) {
        console.log(error)
        console.log('Cloudn\'t establish connection :(')
    }
}
connectToDb()

app.post('/add-contact', async function(request, response) {
    const val=request.body
    console.log(val)
    try {
        await Contact.create({
            "name" : request.body.name,
            "email" : request.body.email,
            "phone" : request.body.phone
        })
        response.status(201).json({
            "status" : "success",
            "message" : "contact created"
        })
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "contact not created",
            "error" : error
        })
    }
})

app.get('/get-contact', async function(request, response) {
    try {
        const contactDetails = await Contact.find()
        response.status(200).json(contactDetails)
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not fetch data",
            "error" : error
        })
    }
})

app.delete('/delete-contact/:id',async function(request,response){
    try{
      const contactEntry=await Contact.findById(request.params.id)
    if(contactEntry){
         await Contact.findByIdAndDelete(request.params.id)
         response.status(200).json({
          "status":"success",
          "message":"contact deleted"
         })
    }else{
      response.status(404).json({
          "status":"failed",
          "message":"contact not deleted"
      })
        
    }
    }catch(error){
      response.status(500).json({
          "status":"failed",
          "message":"could not delete data",
          "error":error
      })
    }
  })
  

  app.patch('/update-contact/:id',async function(request,response){
    try{
      const contactEntry=await Contact.findById(request.params.id)
    if(contactEntry){
        await contactEntry.updateOne({
            "name":request.body.name,
            "email":request.body.email,
            "phone":request.body.phone
         })
         response.status(200).json({
          "status":"success",
          "message":"contact update"
         })
    }else{
      response.status(404).json({
          "status":"failed",
          "message":"contact not update"
      })
        
    }
    }catch(error){
      response.status(500).json({
          "status":"failed",
          "message":"could not update data",
          "error":error
      })
    }
  })
  
  
  app.get('/search-contact', async (request, response) => {
    try {
      const { name, email, phone } = request.query;

      const searchCriteria = {};
      if (name) searchCriteria.name = { $regex: new RegExp(name, 'i') }; 
      if (email) searchCriteria.email = { $regex: new RegExp(email, 'i') }; 
      if (phone) searchCriteria.phone = { $regex: new RegExp(phone, 'i') }; 
  
      
      const searchResults = await Contact.find(searchCriteria);
  
      response.status(200).json({
        status: 'success',
        message: 'Search results retrieved successfully',
        data: searchResults
      });
    } catch (error) {
  
      console.error('Error searching contacts:', error);
      response.status(500).json({
        status: 'failure',
        message: 'Could not search contacts',
        error: error.message
      });
    }
  });