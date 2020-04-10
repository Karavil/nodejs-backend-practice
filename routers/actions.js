const express = require("express");
const db = require("../data/helpers/actionModel.js");

const router = express.Router();

router.get("/:id", validateActionID, (req, res) => {
   db.get(req.params.id)
      .then((action) => {
         res.status(200).json(action);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({
            message: "Error fetching action from database.",
         });
      });
});

router.post("/", validateActionSchema, (req, res) => {
   db.insert(req.body)
      .then((newAction) => {
         res.status(201).json(newAction);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({
            message: "Error while inserting action into database.",
         });
      });
});

router.patch("/:id", validateActionID, validateActionEdit, (req, res) => {
   db.update(req.params.id, req.body)
      .then((updatedAction) => {
         if (updatedAction) {
            res.status(200).json(updatedAction);
         } else {
            res.status(400).json({
               message: "No changes could be made. Bad request",
            });
         }
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({
            message: "Error while updating action in database.",
         });
      });
});

router.delete("/:id", validateActionID, (req, res) => {
   db.remove(req.params.id)
      .then(() => {
         res.status(200).json({ message: "Action deleted." });
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({
            message: "Database error while deleting action.",
         });
      });
});

function validateActionSchema(req, res, next) {
   if (
      req.body.project_id &&
      Number.isInteger(req.body.project_id) &&
      req.body.description &&
      req.body.description.length > 0 &&
      req.body.notes &&
      req.body.notes.length > 0
   ) {
      next();
   } else {
      res.status(400).json({
         message:
            "Please make sure to include a project_id, description, and notes for your action in your request body.",
      });
   }
}

function validateActionEdit(req, res, next) {
   if (
      (req.body.project_id && Number.isInteger(req.body.project_id)) ||
      (req.body.description && req.body.description.length > 0) ||
      (req.body.notes && req.body.notes.length > 0)
   ) {
      next();
   } else {
      res.status(400).json({
         message:
            "Please make sure to include a project_id, description, or notes to update in your action to update/edit.",
      });
   }
}

function validateActionID(req, res, next) {
   db.get(req.params.id)
      .then((action) => {
         if (action) {
            next();
         } else {
            res.status(404).json({ message: "Action id is not valid." });
         }
      })
      .catch((err) => {
         res.status(500).json(
            "Weird error... make sure to have an ID in your request parameters."
         );
      });
}

module.exports = router;
