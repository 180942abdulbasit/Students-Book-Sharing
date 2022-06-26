const Message = require('../models/chat/message')
const Room = require('../models/chat/room')

const createMessageFromSocket = async (data) => {
  try {
    const { body, room, sender } = data
    if (!body || !room || !sender) {
      throw new Error('Incomeplete data.')
    }

    let message = await Message.create({
      body,
      room,
      sender,
    })

    let roomData = await Room.findById(room)
    roomData.messageCount = roomData.messageCount + 1
    await roomData.save()
    message = await message.populate(['room', 'sender'])
    return message
  } catch (error) {
    console.group(error)
  }
}

module.exports = { createMessageFromSocket }
