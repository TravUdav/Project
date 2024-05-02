const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const fs = require("fs");
const session = require("express-session");
const multer = require("multer");

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kinowiki",
});

app.set("view engine", "ejs");
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  next();
});

app.use(express.static(path.join(__dirname, "project")));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login", (req, res) => {
  const { login, password } = req.body;

  const hashedPassword = require("crypto")
    .createHash("md5")
    .update(password)
    .digest("hex");

  connection.query(
    "SELECT id FROM users WHERE login = ? AND password = ?",
    [login, hashedPassword],
    (err, results) => {
      if (err) {
        console.error("Error checking login:", err);
        return res.status(500).send("Error checking login");
      }
      if (results.length === 1) {
        const userId = results[0].id;
        req.session.userId = userId;

        req.session.isLoggedIn = true;
        req.session.save(() => {
          res.redirect("/");
        });
      } else {
        res.render("entry", { error: "Неправильный логин или пароль" });
      }
    }
  );
});

app.get("/profile", (req, res) => {
  if (req.session.isLoggedIn) {
    const userId = req.session.userId;
    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err) {
          console.error("Error fetching user information:", err);
          return res.status(500).send("Error fetching user information");
        }

        const user = results[0];
        res.render(path.join(__dirname, "views", "profile.ejs"), {
          user: user,
          isAdmin: user.admin === 1,
        });
      }
    );
  } else {
    res.redirect("/entry");
  }
});

// BY MOTIK !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get("/admin", (req, res) => {
  if (req.session.isLoggedIn) {
    const userId = req.session.userId;
    connection.query(
      "SELECT admin FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err) {
          console.error("Error fetching user information:", err);
          return res.status(500).send("Error fetching user information");
        }

        if (results.length > 0 && results[0].admin === 1) {
          connection.query("SELECT * FROM films", (err, films) => {
            if (err) {
              console.error("Error fetching films:", err);
              return res.status(500).send("Error fetching films");
            }

            const action = req.query.action;
            const id = req.query.id;

            if (!action) {
              res.render(path.join(__dirname, "views", "admin.ejs"), {
                action: "admin",
                films: films,
              });
            }

            if (action === "add") {
              res.render(path.join(__dirname, "views", "admin_add.ejs"), {
                films: films,
              });
            }

            if (action === "edit") {
              res.render(path.join(__dirname, "views", "admin_edit.ejs"), {
                films: films,
                id: id,
              });
            }

            if (action === "delete") {
              res.render(path.join(__dirname, "views", "admin_delete.ejs"), {
                films: films,
                id: id,
              });
            }



          });
        } else {
          res.redirect("/");
        }
      }
    );
  } else {
    res.redirect("/entry");
  }
});

app.post("/add", upload.single("poster"), (req, res) => {
  const { name, release, genre, annotation } = req.body;
  const poster = req.file.filename;

  connection.query(
    "INSERT INTO films (name, poster, `release`, genre, annotation) VALUES (?, ?, ?, ?, ?)",
    [name, poster, release, genre, annotation],
    (err, result) => {
      if (err) {
        console.error("Error adding film:", err);
        return res.status(500).send("Ошибка при добавлении фильма.");
      }
      res.sendStatus(200);
    }
  );
});

app.put("/edit", upload.single("poster"), (req, res) => {
  const { name, release, genre, annotation, id } = req.body;
  const poster = req.file.filename;

  connection.query(
    "UPDATE films SET name = ?, poster = ?, `release` = ?, genre = ?, annotation = ? WHERE id = ?",
    [name, poster, release, genre, annotation, id],
    (err, result) => {
      if (err) {
        console.error("Error updating film:", err);
        return res.status(500).send("Ошибка при обновлении фильма.");
      }
      res.sendStatus(200);
    }
  );
});

app.delete("/delete", (req, res) => {
  const id = req.query.id;
  console.log(id);

  connection.query(
    "DELETE FROM films WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting film:", err);
        return res.status(500).send("Ошибка при удалении фильма.");
      }
      res.sendStatus(200);
    }
  );
});


/* app.get("/admin_panel", (req, res) => {
  if (req.session.isLoggedIn) {
    const userId = req.session.userId;
    connection.query(
      "SELECT admin FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err) {
          console.error("Error fetching user information:", err);
          return res.status(500).send("Error fetching user information");
        }

        if (results.length > 0 && results[0].admin === 1) {
          connection.query("SELECT * FROM films", (err, films) => {
            if (err) {
              console.error("Error fetching films:", err);
              return res.status(500).send("Error fetching films");
            }

            res.render(path.join(__dirname, "views", "admin_panel.ejs"), {
              action: "admin",
              films: films,
            });
          });
        } else {
          res.redirect("/");
        }
      }
    );
  } else {
    res.redirect("/entry");
  }
});

app.get("/add_film", (req, res) => {
  connection.query("SELECT * FROM films", (err, results) => {
    if (err) {
      console.error("Error fetching films:", err);
      return res.status(500).send("Error fetching films");
    }
    res.render(path.join(__dirname, "views", "admin_panel.ejs"), {
      action: "add",
      films: results,
    });
  });
});

app.post("/add", upload.single("poster"), (req, res) => {
  const { name, release, genre, annotation } = req.body;
  const poster = req.file.filename;

  connection.query(
    "INSERT INTO films (name, poster, `release`, genre, annotation) VALUES (?, ?, ?, ?, ?)",
    [name, poster, release, genre, annotation],
    (err, result) => {
      if (err) {
        console.error("Error adding film:", err);
        return res.status(500).send("Ошибка при добавлении фильма.");
      }
      res.redirect("/add_film");
    }
  );
});

app.get("/edit_film", (req, res) => {
  connection.query("SELECT * FROM films", (err, results) => {
    if (err) {
      console.error("Error fetching films:", err);
      return res.status(500).send("Error fetching films");
    }
    res.render(path.join(__dirname, "views", "admin_panel.ejs"), {
      action: "edit",
      films: results,
    });
  });
});

app.post("/edit/:id", (req, res) => {
  const { name, poster, release, genre, annotation } = req.body;
  const filmId = req.params.id;

  connection.query(
    "UPDATE films SET name = ?, poster = ?, release = ?, genre = ?, annotation = ? WHERE id = ?",
    [name, poster, release, genre, annotation, filmId],
    (err, result) => {
      if (err) {
        console.error("Error updating film:", err);
        return res.status(500).send("Ошибка при обновлении фильма.");
      }
      res.redirect("/edit_film");
    }
  );
});


app.get("/delete_film", (req, res) => {
  connection.query("SELECT * FROM films", (err, results) => {
    if (err) {
      console.error("Error fetching films:", err);
      return res.status(500).send("Error fetching films");
    }
    res.render(path.join(__dirname, "views", "admin_panel.ejs"), {
      action: "delete",
      films: results,
    });
  });
});

app.post("/delete/:id", (req, res) => {
  const filmId = req.params.id;

  connection.query(
    "DELETE FROM films WHERE id = ?",
    [filmId],
    (err, result) => {
      if (err) {
        console.error("Error deleting film:", err);
        return res.status(500).send("Ошибка при удалении фильма.");
      }

      res.redirect("/delete_film");
    }
  );
}); */

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
    }
    res.redirect("/");
  });
});

app.get("/", (req, res) => {
  connection.query("SELECT * FROM films", (err, results) => {
    if (err) {
      console.error("Error fetching films:", err);
      return res.status(500).send("Error fetching films");
    }
    res.render(path.join(__dirname, "views", "home.ejs"), { films: results });
  });
});

app.get("/film_page", (req, res) => {
  const filmId = req.query.film_id;

  connection.query(
    "SELECT * FROM films WHERE id = ?",
    [filmId],
    (err, results) => {
      if (err) {
        console.error("Error fetching film details:", err);
        return res.status(500).send("Error fetching film details");
      }

      if (results.length === 0) {
        return res.status(404).send("Film not found");
      }

      const film = results[0];
      res.render(path.join(__dirname, "views", "film_page.ejs"), { film });
    }
  );
});

app.get("/entry", (req, res) => {
  const successMessage = req.query.success;
  res.render("entry", { error: null, successMessage: successMessage });
});

app.post("/register", (req, res) => {
  const { login, name, password, birth } = req.body;

  const hashedPassword = require("crypto")
    .createHash("md5")
    .update(password)
    .digest("hex");

  connection.query(
    "SELECT * FROM users WHERE login = ?",
    [login],
    (err, results) => {
      if (err) {
        console.error("Error checking existing login:", err);
        return res.status(500).send("Error checking existing login");
      }

      if (results.length > 0) {
        return res.json({
          error: "Логин уже существует. Придумайте другой.",
          successMessage: null,
        });
      } else {
        connection.query(
          "INSERT INTO users (login, name, password, birth, avatar, admin) VALUES (?, ?, ?, ?, ?, ?)",
          [login, name, hashedPassword, birth, "", 0],
          (err, results) => {
            if (err) {
              console.error("Error registering user:", err);
              return res.status(500).send("Error registering user");
            }
            res.json({
              error: null,
              successMessage: "Вы успешно зарегистрировались!",
            });
          }
        );
      }
    }
  );
});

app.get("/feedback", (req, res) => {
  const successMessage = req.query.successMessage || "";
  res.render(path.join(__dirname, "views", "feedback.ejs"), { successMessage });
});

app.post("/submit_feedback", (req, res) => {
  const { name, email, message } = req.body;

  connection.query(
    "INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)",
    [name, email, message],
    (err, results) => {
      if (err) {
        console.error("Error submitting feedback:", err);
        return res.status(500).send("Error submitting feedback");
      }

      res.redirect(
        "/feedback?successMessage=Заявка принята. Спасибо за ваш отзыв!"
      );
    }
  );
});

app.post("/search", (req, res) => {
  const query = req.body.query;

  connection.query(
    "SELECT * FROM films WHERE name LIKE ?",
    [`%${query}%`],
    (err, results) => {
      if (err) {
        console.error("Error searching films:", err);
        return res.status(500).send("Error searching films");
      }

      res.render(path.join(__dirname, "views", "search_results.ejs"), {
        films: results,
      });
    }
  );
});

app.use((req, res) => {
  res.status(404).render("error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
