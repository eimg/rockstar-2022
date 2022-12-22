const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const express = require("express");
const app = express();

const expressWs = require("express-ws")(app);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const { MongoClient, ObjectId } = require("mongodb");
const mongo = new MongoClient("mongodb://localhost");
const db = mongo.db("twitter");

const { relationships } = require("./pipelines");

const secret = "shhhhhh!!";

// auth middleware
const auth = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) 
		return res.status(401).json({ "msg": "invalid: no token provided" });

	jwt.verify(token, secret, function (err, user) {
		if (err) return res.status(403).json({ msg: "invalid token" });

		if (user) {
			res.locals.user = user;
			next();
		}
	});
}

app.post("/login", async (req, res) => {
	const { handle, password } = req.body;
	
	if (!handle || !password) {
		return res.status(403).json({ 
			"msg": "both handle and password are required" 
		});
	}

	let user = await db.collection("users").findOne({ handle });
	if (!user) return res.status(403).json({ "msg": "user not found" });

	const match = await bcrypt.compare(password, user.password);

	if (match) {
		const token = jwt.sign(user, secret);
		return res.status(201).json({ token, user });
	}

	return res.status(403).json({ "msg": "incorrect password" });
});

// Get user by token (through auth middleware)
app.get("/user", auth, async (req, res) => {
	const user = res.locals.user;

	let result = await db.collection("users").findOne({ _id: ObjectId(user._id) });
	if (result) {
		return res.status(200).json(result);
	}

	return res.status(401).json({ msg: "user not found" });
});

// Get user by @handle
app.get("/users/:handle", async (req, res) => {
	let handle = req.params.handle;

	let result = await db.collection("users").aggregate([
		{
			$match: { handle }
		},
		// Followers users relationship
		{
			$lookup: {
				from: "users",
				localField: "followers",
				foreignField: "_id",
				as: "followers_users"
			}
		},
		// Following users relationship
		{
			$lookup: {
				from: "users",
				localField: "following",
				foreignField: "_id",
				as: "following_users"
			}
		},
	]).toArray();

	if (result) {
		return res.status(200).json(result[0]);
	}

	return res.status(401).json({ msg: "user not found" });
});

// Register: create user
app.post("/user", async (req, res) => {
	const { name, handle, profile, password } = req.body;

	if (!name || !handle || !password) {
		return res.status(400).json({ 
			msg: "name, handle and password fields are required" 
		});
	}

	let userExist = await db.collection("users").findOne({ handle });
	if (userExist) {
		return res.status(409).json({ msg: "handle already taken" });
	}

	const hash = await bcrypt.hash(password, 10);

	try {
		let result = await db.collection("users").insertOne({
			name, handle, profile, password: hash, created: new Date()
		});

		let user = await db.collection("users").findOne({ _id: ObjectId(result.insertedId) });
		let token = jwt.sign(user, secret);

		return res.status(201).json({ token, user });

	} catch (e) {
		return res.status(500).json({ msg: e.message });
	}
});

// Update profile: update user
app.put("/users/:id", async (req, res) => {
	const id = req.params.id;
	const { name, profile, password } = req.body;

	if (!name) {
		return res.status(400).json({ msg: "name required" });
	}

	let data = { name, profile };
	if (password) {
		const hash = await bcrypt.hash(password, 10);
		data.password = hash;
	}

	try {
		await db.collection("users").updateOne(
			{ _id: ObjectId(id) },
			{
				$set: data
			}
		);

		let user = await db.collection("users").findOne({ _id: ObjectId(id) });

		return res.status(200).json(user);

	} catch (e) {
		return res.status(500).json({ msg: e.message });
	}
});

// Follow / Unfollow
app.put("/users/:id/follow", auth, async (req, res) => {
	const targetId = req.params.id;
	const actorId = res.locals.user._id;

	const targetUser = await db.collection("users").findOne({
		_id: ObjectId(targetId)
	});

	targetUser.followers = targetUser.followers || [];

	const actorUser = await db.collection("users").findOne({
		_id: ObjectId(actorId)
	});

	actorUser.following = actorUser.following || [];

	if (targetUser.followers.find(item => item.toString() === actorId)) {
		targetUser.followers = targetUser.followers.filter(uid => uid.toString() !== actorId);
		actorUser.following = actorUser.following.filter(uid => uid.toString() !== targetId);
	} else {
		targetUser.followers.push(ObjectId(actorId));
		actorUser.following.push(ObjectId(targetId));
	}

	try {
		await db.collection("users").updateOne(
			{ _id: ObjectId(targetId) },
			{
				$set: { followers: targetUser.followers }
			}
		);

		await db.collection("users").updateOne(
			{ _id: ObjectId(actorId) },
			{
				$set: { following: actorUser.following }
			}
		);

		return res.status(200).json({ 
			followers: targetUser.followers,
			following: actorUser.following 
		});
	} catch (e) {
		return res.status(500).json({ "msg": e.message });
	}
});

// Get latest tweets
app.get("/tweets", async (req, res) => {
	const limit = 20;
	const page = parseInt(req.query.page) || 0;
	const skip = limit * page;

	try {
		let tweets = await db.collection("tweets").aggregate([
			{
				$match: {
					$or: [{ type: "post" }, { type: "share" }]
				}
			},
			{ $sort: { _id: -1 }, },
			{ $skip: skip, },
			{ $limit: limit, },
			...relationships
		]).toArray();

		return res.status(200).json({
			limit,
			page,
			count: tweets.length,
			data: tweets
		});
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

// Get user"s tweets by @handle
app.get("/tweets/users/:handle", async (req, res) => {
	const handle = req.params.handle;
	const limit = 20;
	const page = parseInt(req.query.page) || 0;
	const skip = limit * page;

	try {
		let user = await db.collection("users").findOne({ handle });

		let tweets = await db.collection("tweets").aggregate([
			{
				$match: { owner: user._id }
			},
			{
				$match: {
					$or: [{ type: "post" }, { type: "share" }]
				}
			},
			{ $sort: { _id: -1 }, },
			{ $skip: skip, },
			{ $limit: limit, },
			...relationships
		]).toArray();

		return res.status(200).json({
			limit,
			page,
			count: tweets.length,
			data: tweets
		});
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

// Get user"s comments by @handle
app.get("/comments/users/:handle", async (req, res) => {
	const handle = req.params.handle;
	const limit = 20;
	const page = parseInt(req.query.page) || 0;
	const skip = limit * page;

	try {
		let user = await db.collection("users").findOne({ handle });

		let tweets = await db.collection("tweets").aggregate([
			{
				$match: {
					$and: [{ owner: user._id }, { type: "comment" }]
				}
			},
			{ $sort: { _id: -1 }, },
			{ $skip: skip, },
			{ $limit: limit, },
			...relationships
		]).toArray();

		return res.status(200).json({
			limit,
			page,
			count: tweets.length,
			data: tweets
		});
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

// Get user"s liked tweets by @handle
app.get("/tweets/users/:handle/liked", async (req, res) => {
	const handle = req.params.handle;
	const limit = 20;
	const page = parseInt(req.query.page) || 0;
	const skip = limit * page;

	try {
		let user = await db.collection("users").findOne({ handle });

		let tweets = await db.collection("tweets").aggregate([
			{
				$match: {
					likes: user._id
				}
			},
			{ $sort: { _id: -1 }, },
			{ $skip: skip, },
			{ $limit: limit, },
			...relationships
		]).toArray();

		return res.status(200).json({
			limit,
			page,
			count: tweets.length,
			data: tweets
		});
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

// Get single tweet (including all comments)
app.get("/tweets/:id", async (req, res) => {
	const id = req.params.id;

	try {
		let tweets = await db.collection("tweets").aggregate([
			{
				$match: { _id: ObjectId(id) }
			},
			...relationships
		]).toArray();

		return res.status(200).json({ data: tweets[0] });
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

// Add new tweet
app.post("/tweets", auth, async (req, res) => {
	const tweet = req.body.tweet;
	const user = res.locals.user._id;

	if (!tweet) return res.status(400).json({ msg: "Tweet body required" });

	try {
		let result = await db.collection("tweets").insertOne({
			type: "post",
			body: tweet,
			created: new Date(),
			owner: ObjectId(user),
			likes: [],
		});

		let data = await db.collection("tweets").aggregate([
			{
				$match: { _id: ObjectId(result.insertedId) },
			},
			{
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "user"
				}
			},
		]).toArray();

		return res.status(201).json(data);

	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

// Add new reply (comment)
app.post("/reply/:id", auth, async (req, res) => {
	const id = req.params.id;
	const tweet = req.body.tweet;
	const user = res.locals.user._id;

	if (!tweet) return res.status(400).json({ msg: "Tweet body required" });

	try {
		let result = await db.collection("tweets").insertOne({
			type: "comment",
			body: tweet,
			origin: ObjectId(id),
			created: new Date(),
			owner: ObjectId(user),
			likes: [],
		});

		let data = await db.collection("tweets").aggregate([
			{
				$match: { _id: ObjectId(result.insertedId) },
			},
			{
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "user"
				}
			},
		]).toArray();

		return res.status(201).json(data);

	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

// Add new share
app.post("/tweets/:id/share", auth, async (req, res) => {
	const id = req.params.id;
	const tweet = req.body.tweet;
	const user = res.locals.user._id;

	try {
		let result = await db.collection("tweets").insertOne({
			type: "share",
			body: tweet,
			origin: ObjectId(id),
			created: new Date(),
			owner: ObjectId(user)
		});

		let data = await db.collection("tweets").aggregate([
			{
				$match: { _id: ObjectId(result.insertedId) },
			},
			{
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "user"
				}
			},
			{
				$lookup: {
					from: "tweets",
					localField: "origin",
					foreignField: "_id",
					as: "origin_tweet",
					pipeline: [
						{
							$lookup: {
								from: "users",
								localField: "owner",
								foreignField: "_id",
								as: "user"
							}
						}
					]
				}
			},
		]).toArray();

		return res.status(201).json(data);

	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

// Add new comment
app.post("/tweets/:id/comment", auth, async (req, res) => {
	const id = req.params.id;
	const tweet = req.body.tweet;
	const user = res.locals.user._id;

	if (!tweet) return res.status(400).json({ msg: "Comment body required" });

	try {
		let result = await db.collection("tweets").insertOne({
			type: "comment",
			body: tweet,
			origin: ObjectId(id),
			created: new Date(),
			owner: ObjectId(user)
		});

		let data = await db.collection("tweets").findOne({
			_id: ObjectId(result.insertedId)
		});

		return res.status(201).json(data);

	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

// Add / Remove like
app.put("/tweets/:id/like", auth, async (req, res) => {
	const id = req.params.id;
	const user = res.locals.user._id;

	const tweet = await db.collection("tweets").findOne({
		_id: ObjectId(id)
	});

	tweet.likes = tweet.likes || [];

	if (tweet.likes.find(item => item.toString() === user)) {
		tweet.likes = tweet.likes.filter(uid => uid.toString() !== user);
	} else {
		tweet.likes.push(ObjectId(user));
	}

	try {
		await db.collection("tweets").updateOne(
			{ _id: ObjectId(id) },
			{
				$set: tweet
			}
		);

		return res.status(200).json(tweet.likes);
	} catch (e) {
		return res.status(500).json({ "msg": e.message });
	}
});

// Delete tweet
app.delete("/tweets/:id", auth, async (req, res) => {
	const _id = req.params.id;
	const user = res.locals.user;

	try {
		let result = await db.collection("tweets").deleteOne({
			_id: ObjectId(_id),
			owner: ObjectId(user._id),
		});

		return res.status(200).json(result);

	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

// Get latest notis
app.get("/notis", auth, async (req, res) => {
	const user = res.locals.user;

	try {
		let result = await db.collection("notis").aggregate([
			{
				$match: { owner: ObjectId(user._id) }
			},
			{
				$sort: { _id: -1 }
			},
			{
				$limit: 40
			},
			{
				$lookup: {
					from: "users",
					localField: "actor",
					foreignField: "_id",
					as: "user"
				}
			}
		]).toArray();

		return res.status(200).json(result);

	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

// Add new noti
// Fix: Noti creation should be private server-side action
// not an open API end-point.
app.post("/notis", auth, async (req, res) => {
	const user = res.locals.user;
	const { type, target } = req.body;

	let tweet = await db.collection("tweets").findOne({
		_id: ObjectId(target)
	});

	// No noti for unlike
	if (!tweet.likes.find(item => item.toString() === user._id)) 
		return res.status(304).end();

	// No noti for own posts
	if(user._id === tweet.owner.toString())
		return res.status(304).end();

	// Fix: Repetitive notis for same actions
	// e.g., like, then unlike, then like again
	// maybe remove old identical notis
	let result = await db.collection("notis").insertOne({
		type,
		actor: ObjectId(user._id),
		msg: `${type}s your tweet.`,
		target: ObjectId(target),
		owner: tweet.owner,
		read: false,
		created: new Date(),
	});

	let noti = await db.collection("notis").findOne({
		_id: result.insertedId
	});

	const webSocketClient = subscribers.filter(subscriber => {
		return subscriber.uid === tweet.owner.toString();
	})[0];

	if (webSocketClient) {
		webSocketClient.conn.send(JSON.stringify(noti));
		console.log("broadcasting noti to: " + noti.owner);
	}

	return res.status(201).json(noti);
});

// Mark all notis read
app.put("/notis", auth, (req, res) => {
	const user = res.locals.user;

	db.collection("notis").updateMany(
		{ owner: ObjectId(user._id) },
		{
			$set: { read: true }
		}
	);

	return res.status(200).json({ msg: "all notis marked read" });
});

// Mark one noti read
app.put("/notis/:id", auth, async (req, res) => {
	const id = req.params.id;

	db.collection("notis").updateOne(
		{ _id: ObjectId(id) },
		{
			$set: { read: true }
		}
	);

	return res.status(200).json({ msg: "noti marked read" });
});

const subscribers = [];

app.ws("/subscribe", (conn, req) => {
	conn.on("message", token => {
		if(token) {
			jwt.verify(token, secret, function (err, user) {
				if (err) console.log("invalid token");

				if (user) {
					if (!subscribers.find(subscriber => subscriber.uid === user._id.toString())) {
						subscribers.push({ uid: user._id, conn });

						console.log("adding subscription: " + user._id);
					}
				}
			});
		} else {
			console.log("token required");
		}
	});
});

app.listen(8000, () => {
	console.log("App listening at 8000...");
});
