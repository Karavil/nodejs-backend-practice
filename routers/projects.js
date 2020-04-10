const express = require("express");
const db = require("../data/helpers/projectModel.js");

const router = express.Router();

router.get("/:id", validateProjectID, (req, res) => {
   db.get(req.params.id)
      .then((project) => {
         res.status(200).json(project);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({
            message: "Error fetching project from database.",
         });
      });
});

router.get("/:id/actions", validateProjectID, (req, res) => {
   db.getProjectActions(req.params.id)
      .then((actions) => {
         res.status(200).json(actions);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({
            message: "Error fetching project actions from database.",
         });
      });
});

router.post("/", validateProjectSchema, (req, res) => {
   db.insert(req.body)
      .then((postedProject) => {
         res.status(201).json(postedProject);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({
            message: "Error while inserting project into database.",
         });
      });
});

router.patch("/:id", validateProjectID, validateProjectEdit, (req, res) => {
   db.update(req.params.id, req.body)
      .then((updatedProject) => {
         if (updatedProject) {
            res.status(200).json(updatedProject);
         } else {
            res.status(400).json({
               message: "No changes could be made. Bad request",
            });
         }
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({
            message: "Error while updating project in database.",
         });
      });
});

router.delete("/:id", validateProjectID, (req, res) => {
   db.remove(req.params.id)
      .then(() => {
         res.status(200).json({ message: "Project deleted." });
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({
            message: "Database error while deleting project.",
         });
      });
});

function validateProjectSchema(req, res, next) {
   if (
      req.body.name &&
      req.body.description &&
      req.body.name.length > 0 &&
      req.body.description > 0
   ) {
      next();
   } else {
      res.status(400).json({
         message:
            "Please make sure to include a name and description for your project in your request body.",
      });
   }
}

function validateProjectEdit(req, res, next) {
   if (
      (req.body.name && req.body.name.length > 0) ||
      (req.body.description && req.body.description > 0)
   ) {
      next();
   } else {
      res.status(400).json({
         message:
            "Please make sure to include a name or description to update in your project to update/edit.",
      });
   }
}

function validateProjectID(req, res, next) {
   db.get(req.params.id)
      .then((project) => {
         if (project) {
            next();
         } else {
            res.status(404).json({ message: "Project id is not valid." });
         }
      })
      .catch((err) => {
         res.status(500).json(
            "Weird error... make sure to have an ID in your request parameters."
         );
      });
}

module.exports = router;
