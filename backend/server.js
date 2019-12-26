import express from "express";
import mongodb from "mongodb";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
dotenv.config();

const dbUrl = `mongodb://admin:Password1@ds145463.mlab.com:45463/my-react-redux-movie-api`;

const validate = data => {
  let errors = [];
  if (!data.title || data.title === "") errors.title = "Can't be empty";
  if (!data.cover || data.cover === "") errors.cover = "Can't be empty";
  if (data.instructor || data.instructor !== "") {
    errors.push({
      field: "instructor",
      errors: ["Can't be empty", "Can't be empty2", "Can't be empty3"]
    });
  }
  console.log(errors);
  const isValid = Object.keys(errors).length === 0;
  return { errors, isValid };
};

mongodb.MongoClient.connect(dbUrl, (err, db) => {
  if (err) {
    throw new Error(err);
  }

  app.get("/api/courses", (req, res) => {
    setTimeout(() => {
      db.collection("courses")
        .find({})
        .toArray((err, courses) => {
          res.json({ courses });
        });
    }, 2000);
  });

  app.post("/api/courses", (req, res) => {
    const { errors, isValid } = validate(req.body);
    setTimeout(() => {
      if (isValid) {
        const { title, instructor, cover } = req.body;
        db.collection("courses").insert(
          { title, instructor, cover },
          (err, result) => {
            if (err) {
              res
                .status(500)
                .json({ errors: { global: "Something went wrong" } });
            } else {
              res.json({ course: result.ops[0] });
            }
          }
        );
      } else {
        res.status(400).json({ errors });
      }
    }, 3000);
  });

  app.put("/api/courses/:_id", (req, res) => {
    const { errors, isValid } = validate(req.body);

    if (isValid) {
      const { title, instructor, cover } = req.body;
      setTimeout(() => {
        db.collection("courses").findOneAndUpdate(
          { _id: new mongodb.ObjectId(req.params._id) },
          { $set: { title, instructor, cover } },
          { returnOriginal: false },
          (err, result) => {
            if (err) {
              res.status(500).json({ errors: { global: err } });
              return;
            }

            res.json({ course: result.value });
          }
        );
      }, 2000);
    } else {
      res.status(400).json({ errors });
    }
  });

  app.get("/api/courses/:_id", (req, res) => {
    db.collection("courses").findOne(
      { _id: new mongodb.ObjectId(req.params._id) },
      (err, course) => {
        res.json({ course });
      }
    );
  });

  app.delete("/api/courses/:_id", (req, res) => {
    setTimeout(() => {
      db.collection("courses").deleteOne(
        { _id: new mongodb.ObjectId(req.params._id) },
        (err, r) => {
          if (err) {
            res.status(500).json({ errors: { global: err } });
            return;
          }

          res.json({});
        }
      );
    }, 2000);
  });

  app.use((req, res) => {
    res.status(404).json({
      errors: {
        global:
          "Still working on it. Please try again later when we implement it."
      }
    });
  });

  app.listen(8080, () => console.log("Server is running on localhost:8080"));
});
