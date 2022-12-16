const relationships = [
	// Owner user relationship
	{
		$lookup: {
			from: "users",
			localField: "owner",
			foreignField: "_id",
			as: "user"
		}
	},
	// Origin tweet relationship
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
	// Liked users relationship
	{
		$lookup: {
			from: "users",
			localField: "likes",
			foreignField: "_id",
			as: "likes_users"
		}
	},
	// Shared tweet relationship
	{
		$lookup: {
			from: "tweets",
			localField: "_id",
			foreignField: "origin",
			as: "shares",
			pipeline: [
				{
					$match: { type: "share" }
				},
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
	// Tweet comments relationship
	{
		$lookup: {
			from: "tweets",
			localField: "_id",
			foreignField: "origin",
			as: "comments",
			pipeline: [
				{
					$match: { type: "comment" }
				},
				// Comment user
				{
					$lookup: {
						from: "users",
						localField: "owner",
						foreignField: "_id",
						as: "user"
					}
				},
				// Nested comments
				{
					$lookup: {
						from: "tweets",
						localField: "_id",
						foreignField: "origin",
						as: "comments",
						pipeline: [
							{
								$match: { type: "comment" }
							}
						]
					}
				},
				// Nested shares
				{
					$lookup: {
						from: "tweets",
						localField: "_id",
						foreignField: "origin",
						as: "shares",
						pipeline: [
							{
								$match: { type: "share" }
							}
						]
					}
				},
			]
		}
	},
];

module.exports = { relationships };
