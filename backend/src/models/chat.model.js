import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			validate: {
				validator: function(value){
					if(this.isGroupChat){
						return value !== null;
					}
					return true;
				},
				message: "Chat name is required"
			}
		},
		isGroupChat: {
			type: Boolean,
			required: true
		},
		lastMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			}
		],
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			validate: {
				validator: function(value){
					if(this.isGroupChat){
						return value !== null;
					}
					return true
				},
				message: "Group admin is required"
			}
		}
	},
	{
		timestamps: true
	}
)

export const Chat = mongoose.model("Chat",chatSchema);