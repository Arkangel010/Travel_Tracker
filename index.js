import express from "express";
import bodyParser from "body-parser";
import pg from "pg"; 
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const db = new pg.Client({
    user : "postgres",
    host : "localhost", 
    database : "demo",
    password : "0824",
    port : 5432
});

db.connect(); 

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code from visited_cont"); 
  let country = []; 
  result.rows.map((num) =>{
    country.push(num.country_code); 
  })

  console.log(country); 
  res.render("index.ejs", {countries: country, total : result.rowCount}); 
});


app.post("/add", async (req, res) => {
  let countryName = req.body.country;
  countryName = countryName.trim(); 

  const result = await db.query("SELECT country_id FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';", [countryName.toLowerCase()]); 
  console.log(result.rows[0].country_id);
  if(result.rowCount != 0){
    const CC = result.rows[0].country_id;
    await db.query("INSERT INTO visited_cont (country_code) VALUES ($1)", [CC]); 
    res.redirect("/"); 
  }
  
}); 





