const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("./cors");
const Leaders = require("../models/leaders");
const authenticate = require("../authenticate");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter
	.route("/")
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, (req, res, next) => {
		Leaders.find({})
			.then(
				(leaders) => {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(leaders);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Leaders.create(req.body)
			.then(
				(leader) => {
					console.log("Leader Created ", leader);
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(leader);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /leaders");
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Leaders.deleteMany({})
			.then(
				(resp) => {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(resp);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	});

//PARAMS

leaderRouter.route("/:leaderId");
leaderRouter.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Leaders.findById(req.params.leaderId)
		.then(
			(leader) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(leader);
			},
			(err) => next(err)
		)
		.catch((err) => next(err));
});
leaderRouter.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.end("POST operation not supported on /leaders/" + req.params.leaderId);
});
leaderRouter.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Leaders.findByIdAndUpdate(
		req.params.leaderId,
		{
			$set: req.body,
		},
		{ new: true }
	)
		.then(
			(leader) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(leader);
			},
			(err) => next(err)
		)
		.catch((err) => next(err));
});
leaderRouter.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Leaders.deleteOne({ _id: req.params.leaderId })
		.then(
			(resp) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(resp);
			},
			(err) => next(err)
		)
		.catch((err) => next(err));
});

module.exports = leaderRouter;
