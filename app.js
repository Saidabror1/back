const express = require('express')
const fs = require('fs')
const path = require('path')
const { v4: uuid4 } = require('uuid')
const app = express()
const dotenv = require("dotenv")

dotenv.config()

app.set('views', "views")
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

function sort(DATA, value) {
   let data = []
   DATA.map(item => {
      if (!data.includes(item[value])) {
         data.push(item[value])
      }
   })
   return data
}


app.get("/data", (req, res) => {
   fs.readFile(path.join(__dirname, "data.json"), "utf8", (err, data) => {
      if (err) throw err
      let DATA = JSON.parse(data)
      let ism = sort(DATA, "name")
      let telefon = sort(DATA, "telefon")

      res.render("allPerson", { title: "All data", ism, telefon, data: DATA, length: DATA.length })
   })
})

app.get("/filter/:type/:value", (req, res) => {
   fs.readFile(path.join(__dirname, "./data.json"), "utf8", (err, data) => {
      if (err) throw err
      let DATA = JSON.parse(data)

      let ism = sort(DATA, "name")
      let telefon = sort(DATA, "telefon")


      DATA = DATA.filter(item => item[req.params.type] == req.params.value)
      res.render("allPerson", { title: "Filter data", ism, telefon, data: DATA, length: DATA.length })
   })
})


//Page add Data
app.get("/", (req, res) => {
   res.render("addData", { title: "Add Data" })
})

//Add data
app.post("/", (req, res) => {

   fs.readFile(path.join(__dirname, "./data.json"), "utf8", (err, data) => {
      if (err) throw err
      let DATA = JSON.parse(data)
      DATA.push({ id: uuid4(), ...req.body })
      fs.writeFile(path.join(__dirname, "./data.json"), JSON.stringify(DATA), (err, data) => {
         if (err) throw err
         res.redirect('/data')
      })
   })
})
// Delete data
app.get("/delete/:id", (req, res) => {
   fs.readFile(path.join(__dirname, "./data.json"), "utf8", (err, data) => {
      if (err) throw err
      let DATA = JSON.parse(data)
      DATA = DATA.filter(item => item.id !== req.params.id)
      fs.writeFile(path.join(__dirname, "./data.json"), JSON.stringify(DATA), (err, data) => {
         if (err) throw err
         res.redirect('/data')
      })
   })
})

// Update data
app.get("/update/:id", (req, res) => {
   fs.readFile(path.join(__dirname, "./data.json"), "utf8", (err, data) => {
      if (err) throw err
      data = JSON.parse(data)
      data = data.filter(item => item.id == req.params.id)[0]
      res.render("update", { title: "Update data", data })
   })
})

app.post("/update/:id", (req, res) => {
   fs.readFile(path.join(__dirname, "./data.json"), "utf8", (err, data) => {
      if (err) throw err
      data = JSON.parse(data)
      data = data.map(item => {
         if (item.id == req.params.id) {
            return { ...item, name: req.body.name }
         }
         return item
      })
      fs.writeFile(path.join(__dirname, "data.json"), JSON.stringify(data), (ERR, DATA) => {
         if (ERR) throw ERR
         res.redirect("/data")
      })
   })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
   console.log(`App listening on port ${PORT}!`);
});